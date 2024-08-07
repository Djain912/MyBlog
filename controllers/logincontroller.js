
import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ token });
  };


// const login = async (req, res) => {
//     const { email, password } = req.body;
//     if (!email || !password) {
//       return res.status(400).json({ message: 'All fields are required' });
//     }
  
//     try {
//       // Check if user already exists
//       const existingUser = await User.findOne({ email });
//       if (existingUser) {
//         return res.status(400).json({ message: 'User already exists' });
//       }
  
//       // Hash the password
//       const hashedPassword = await bcrypt.hash(password, 10);
  
//       // Create new user
//       const newUser = new User({
//         email,
//         password: hashedPassword,
//       });
//       await newUser.save();
  
//       res.status(201).json({ message: 'User created successfully' });
//     } catch (error) {
//       console.error('Error creating user:', error);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   };
  

  export default login;
