const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const userRoutes = require('./routes/UserRoutes');
const propertyRoutes = require('./routes/PropertiesRoutes');
const propertyassetsRoutes = require('./routes/PropertyAssetsRoutes');
const propertydocumentsRoutes = require('./routes/PropertyDocumentsRoutes');
const adminRoutes = require('./routes/AdminRoutes');
const incomeRoutes = require('./routes/IncomeRoutes');
const expenseRoutes = require('./routes/ExpenseRoutes');
const leadRoutes = require('./routes/LeadRoutes');
const notificationRoutes = require('./routes/NotificationsRoutes');
const searchRoutes = require('./routes/SearchRoutes');
const agentRoutes = require('./routes/AgentRoutes');
const amenitiesRoutes = require('./routes/AmenitiesRoutes');
const messagesRoutes = require('./routes/MessagesRoutes');
const filterRoutes = require('./routes/FilterRoutes');

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Property Management API!');
});

// API routes
app.use('/api/user', userRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/assets', propertyassetsRoutes);
app.use('/api/documents', propertydocumentsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/income', incomeRoutes);
app.use('/api/expense', expenseRoutes);
app.use('/api/lead', leadRoutes);
app.use('/api/notification', notificationRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api/amenities', amenitiesRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/filter', filterRoutes);

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB is connected'))
  .catch((err) => console.log(err));

// Start the server
const port = process.env.PORT || 3007;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
