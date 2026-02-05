const express = require('express');
const cookieParser = require('cookie-parser');
const { errorHandler, notFound } = require('../middleware/errorHandler');
const authRoutes = require('../routes/authRoutes');
const collegeRoutes = require('../routes/collegeRoutes');
const reviewRoutes = require('../routes/reviewRoutes');
const userRoutes = require('../routes/userRoutes');
const adminRoutes = require('../routes/adminRoutes');
const chatbotRoutes = require('../routes/chatbotRoutes');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/colleges', collegeRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chatbot', chatbotRoutes);

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'OK' });
});

app.use(notFound);
app.use(errorHandler);

module.exports = (req, res) => app(req, res);
