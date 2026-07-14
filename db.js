const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/user');

async function connectDB(uri, dbName) {
  await mongoose.connect(uri, { dbName, serverSelectionTimeoutMS: 5000 });
}

async function ensureDefaultAdmin() {
  const defaultAdmin = await User.findOne({ username: 'admin' });
  if (!defaultAdmin) {
    const passwordHash = await bcrypt.hash('admin123', 10);
    await User.create({ username: 'admin', passwordHash });
    console.log('Created default admin user');
  }
}

module.exports = { connectDB, ensureDefaultAdmin };
