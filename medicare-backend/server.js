require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./src/app');

// Handle Uncaught Exceptions
process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

// Database Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Atlas connected: ${conn.connection.host}`);
  } catch (err) {
    console.log('❌ DB Connection Error: ', err.message);
    console.log('\n⚠️  ACTION REQUIRED: Go to MongoDB Atlas → Network Access → Add IP: 0.0.0.0/0');
    process.exit(1);
  }
};
connectDB();

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`🚀 App running on port ${port} in ${process.env.NODE_ENV || 'development'} mode...`);
});

// Handle Unhandled Rejections
process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
