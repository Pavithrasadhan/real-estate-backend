const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const upload = require('../middleware/Multer');
const fs = require('fs');
const { body, validationResult } = require('express-validator');

// Register new user
router.post('/register', [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { first_name, last_name, email, phone, password, role } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const hashedPassword = bcryptjs.hashSync(password, 10);
        const newUser = new User({ first_name, last_name, email, phone, password: hashedPassword, role });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (err) {
        next(err);
    }
});

// User Login
router.post('/login', async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isPasswordCorrect = bcryptjs.compareSync(password, user.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: 'Wrong credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        const { password: pass, ...rest } = user._doc;

        res.cookie('access_token', token, { httpOnly: true }).status(200).json({ ...rest, token });
    } catch (err) {
        next(err);
    }
});

// Get all users with pagination and filtering by role
router.get('/', async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const role = req.query.role || ''; 

        let filter = {};
        if (role) {
            filter.role = role; 
        }

        const total = await User.countDocuments(filter);
        const users = await User.find(filter)
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            users,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
        });
    } catch (err) {
        next(err);
    }
});

// Get user by first name (for Buyer, Agent, and Owner)
router.get('/:role/:first_name', async (req, res, next) => {
    try {
        const { role, first_name } = req.params;
        const user = await User.findOne({ first_name, role })
            .select('first_name last_name email phone');

        if (!user) {
            return res.status(404).json({ message: `${role} not found` });
        }
        res.json(user);
    } catch (err) {
        next(err);
    }
});

router.get('/Owner', async (req, res) => {
    const { name } = req.query;
    if (!name) {
        return res.status(400).json({ error: 'Owner name is required.' });
    }
    try {
        // Find user by first_name or last_name
        const user = await User.findOne({
            $or: [
                { first_name: name },
                { last_name: name }
            ],
            role: 'Owner' // Ensure the role is 'Owner'
        });

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'Owner not found.' });
        }
    } catch (error) {
        console.error("Error fetching owner:", error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

router.get('/Agent', async (req, res) => {
    const { name } = req.query;
    if (!name) {
        return res.status(400).json({ error: 'Agent name is required.' });
    }
    try {
        // Find user by first_name or last_name
        const user = await User.findOne({
            $or: [
                { first_name: name },
                { last_name: name }
            ],
            role: 'Agent' // Ensure the role is 'Owner'
        });

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'Agent not found.' });
        }
    } catch (error) {
        console.error("Error fetching agent:", error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});


router.get('/', async (req, res) => {
    const { name } = req.query;
    try {
        const user = await User.findOne({ name });
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new agent with a single image upload
router.post('/', upload.single('image'), async (req, res) => {
    const { first_name, last_name, email, phone, password, role } = req.body;
  
    try {
      if (!first_name || !last_name || !email || !phone || !password || !role) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      const newUser = new User({
        first_name,
        last_name,
        email,
        phone,
        password,
        role,
        image: req.file ? req.file.path : null, 
      });
  
      await newUser.save();
      res.status(201).json({ newUser });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });


// Update user information
router.put('/:id', upload.single('image'), async (req, res, next) => {
    const { first_name, last_name, email, phone, password, role } = req.body;

    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({message: 'User not found'});

        user.first_name = first_name;
        user.last_name = last_name;
        user.email = email;
        user.phone = phone;
        user.password = password;
        user.role = role;

        if(req.file) {
            if(user.image && fs.existsSync(user.image)) {
                try{
                    fs.unlinkSync(user.image);
                }catch (error){
                    console.error('Error deleting file: ', error);
                }
            }
            user.image = req.file.path;
        }
        await user.save();
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', async(req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'user not found'});
        }

        await user.deleteOne();
        res.status(200).json({ message: 'user deleted successfully'});
    }catch(err) {
        res.status(500).json({ message: err.message});
    }
});

// Delete user
router.delete('/:id/image', async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.image && fs.existsSync(user.image)) {
            try {
                fs.unlinkSync(user.image);
            }catch (error) {
                console.error('Error deleting file', error);
            }
        }

        await user.deleteOne();
        res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        next(err);
    }
});

// **Profile Management - Update User Profile**
router.put('/profile/:id', async (req, res, next) => {
    try {
        const { password, ...updateFields } = req.body;

        if (password) {
            updateFields.password = bcryptjs.hashSync(password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, updateFields, { new: true });
        if (!updatedUser) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ message: "Profile updated successfully", updatedUser });
    } catch (err) {
        next(err);
    }
});

router.get('/profile/:id', async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password'); 
        if (!user) return res.status(404).json({ message: "Profile not found" });

        res.json(user);
    } catch (err) {
        next(err);
    }
});

// **Profile Management - Delete User Profile**
router.delete('/profile/:id', async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        await user.deleteOne();
        res.status(200).json({ message: "Profile deleted successfully" });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
