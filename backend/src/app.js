const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const settingRoutes = require('./routes/settingRoutes');
const documentRoutes = require('./routes/documentRoutes');

dotenv.config(); 
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); 
app.use(cors()); 
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Test route
app.get('/', (req, res) => {
  res.send('HR Platform API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/documents', documentRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});