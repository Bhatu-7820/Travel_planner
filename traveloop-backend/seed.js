require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/traveloop');
    console.log('MongoDB connected for seeding...');

    const adminEmail = 'girase@gmail.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('Admin already exists. Updating role...');
      existingAdmin.role = 'admin';
      await existingAdmin.save();
    } else {
      console.log('Creating new admin user...');
      await User.create({
        name: 'Super Admin',
        email: adminEmail,
        password: '12bh34at',
        role: 'admin'
      });
    }

    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedAdmin();
