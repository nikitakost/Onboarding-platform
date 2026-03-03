const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, position } = req.body;
 
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'There is already a user with this email' });
    }

    // Heshing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'Employee',
      position
    });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

 
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Wrong email or password' });
    }

   
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Wrong email or password' });
    }

    // Gennerate JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role }, 
      process.env.JWT_SECRET,                
      { expiresIn: '1d' }                    
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
        vibeResult: user.vibeResult
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера при отриманні користувачів', error: error.message });
  }
};

exports.updateVibeResult = async (req, res) => {
  try {
    const { result } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId, 
      { vibeResult: result }, 
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Помилка при збереженні результату', error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, position } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { name, position },
      { new: true } 
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Помилка при оновленні профілю', error: error.message });
  }
};