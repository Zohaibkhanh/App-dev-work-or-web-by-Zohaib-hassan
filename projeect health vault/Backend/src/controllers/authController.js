// src/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

class AuthController {
  // Register user
  static async register(req, res) {
    let connection;
    try {
      const { name, email, password } = req.body;
      
      if (!name || !email || !password) {
        return res.status(400).json({ 
          success: false,
          error: 'Name, email, and password are required' 
        });
      }
      
      connection = await db.connect();
      
      // Check if user exists
      const checkResult = await connection.execute(
        'SELECT user_id FROM users WHERE email = :email',
        { email }
      );
      
      if (checkResult.rows.length > 0) {
        return res.status(400).json({ 
          success: false,
          error: 'Email already registered' 
        });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Handle date - SIMPLE WAY
      let dateOfBirth = null;
      if (req.body.dateOfBirth) {
        dateOfBirth = req.body.dateOfBirth; // Expecting 'YYYY-MM-DD'
      }
      
      // INSERT USER - SIMPLE VERSION
      await connection.execute(
        `INSERT INTO users (name, email, password_hash, blood_type, phone_number, date_of_birth) 
         VALUES (:name, :email, :password_hash, :blood_type, :phone_number, :date_of_birth)`,
        {
          name,
          email,
          password_hash: hashedPassword,
          blood_type: req.body.bloodType || null,
          phone_number: req.body.phoneNumber || null,
          date_of_birth: dateOfBirth
        },
        { autoCommit: true }
      );
      
      // Get the created user
      const userResult = await connection.execute(
        'SELECT user_id, name, email, blood_type, phone_number, date_of_birth, created_at FROM users WHERE email = :email',
        { email }
      );
      
      const row = userResult.rows[0];
      const userId = row[0];
      
      console.log(`✅ User registered: ${email} (ID: ${userId})`);
      
      const user = {
        userId: row[0],
        name: row[1],
        email: row[2],
        bloodType: row[3],
        phoneNumber: row[4],
        dateOfBirth: row[5],
        createdAt: row[6]
      };
      
      // Create token
      const token = jwt.sign(
        { userId, email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );
      
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        token,
        user
      });
      
    } catch (error) {
      console.error('❌ Registration error:', error.message);
      
      if (error.message.includes('ORA-00001')) {
        return res.status(400).json({ 
          success: false,
          error: 'Email already registered' 
        });
      }
      
      res.status(500).json({ 
        success: false,
        error: 'Registration failed' 
      });
    }
  }
  
  // Login user
  static async login(req, res) {
    let connection;
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ 
          success: false,
          error: 'Email and password are required' 
        });
      }
      
      connection = await db.connect();
      
      const result = await connection.execute(
        'SELECT user_id, name, email, password_hash, blood_type, phone_number, date_of_birth, created_at FROM users WHERE email = :email',
        { email }
      );
      
      if (result.rows.length === 0) {
        return res.status(401).json({ 
          success: false,
          error: 'Invalid email or password' 
        });
      }
      
      const row = result.rows[0];
      const user = {
        userId: row[0],
        name: row[1],
        email: row[2],
        passwordHash: row[3],
        bloodType: row[4],
        phoneNumber: row[5],
        dateOfBirth: row[6],
        createdAt: row[7]
      };
      
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        return res.status(401).json({ 
          success: false,
          error: 'Invalid email or password' 
        });
      }
      
      console.log(`✅ User logged in: ${email}`);
      
      const token = jwt.sign(
        { userId: user.userId, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );
      
      const { passwordHash, ...userWithoutPassword } = user;
      
      res.json({
        success: true,
        message: 'Login successful',
        token,
        user: userWithoutPassword
      });
      
    } catch (error) {
      console.error('❌ Login error:', error.message);
      res.status(500).json({ 
        success: false,
        error: 'Login failed' 
      });
    }
  }
  
  // Get user profile
  static async getProfile(req, res) {
    let connection;
    try {
      connection = await db.connect();
      
      const result = await connection.execute(
        'SELECT user_id, name, email, blood_type, phone_number, date_of_birth, created_at FROM users WHERE user_id = :id',
        { id: req.userId }
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ 
          success: false,
          error: 'User not found' 
        });
      }
      
      const row = result.rows[0];
      const user = {
        userId: row[0],
        name: row[1],
        email: row[2],
        bloodType: row[3],
        phoneNumber: row[4],
        dateOfBirth: row[5],
        createdAt: row[6]
      };
      
      res.json({ 
        success: true, 
        user
      });
      
    } catch (error) {
      console.error('❌ Get profile error:', error.message);
      res.status(500).json({ 
        success: false,
        error: 'Failed to get profile' 
      });
    }
  }
}

module.exports = AuthController;