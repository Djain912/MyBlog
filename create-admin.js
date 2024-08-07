import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'; // Corrected the typo here
import User from './models/user.js';
import dotenv from "dotenv";

dotenv.config();



const URI = process.env.MONGODB_URI;

mongoose.connect(URI, {
  // Removed deprecated options
}).then(async () => {
  const adminEmail = 'admin@example.com'; // Use a secure email
  const adminPassword = 'adminsumit312'; // Use a secure password

  try {
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      console.log(hashedPassword);
      const newAdmin = new User({
        email: adminEmail,
        password: hashedPassword,
      });
      await newAdmin.save();
      console.log('Admin user created');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}).catch(err => console.error('Connection error:', err));
