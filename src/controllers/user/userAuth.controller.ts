import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../../model/User/userAuth.model';

const JWT_SECRET = '9965738658'; // Change to a secure secret

class UserController {
  static async registerUser(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, phonenumber, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      user = await User.findOne({ phonenumber });
      if (user) {
        return res.status(400).json({ message: 'Phone number already exists' });
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      user = new User({
        username,
        email,
        phonenumber,
        password: hashedPassword,
      });

      await user.save();

      const payload = { user: { id: user.id } };

      jwt.sign(payload, JWT_SECRET, { expiresIn: '3000h' }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (error) {
      console.error(error instanceof Error ? error.message : 'Unknown error');
      res.status(500).send('Server error');
    }
  }

  static async getAllUsers(req: Request, res: Response) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      res.status(500).send('Server error');
    }
  }

  static async loginUser(req: Request, res: Response) {
    const { phonenumber, username, email, password } = req.body;

    if (!(phonenumber || username || email) || !password) {
      return res.status(400).json({ message: 'Please provide valid credentials' });
    }

    try {
      let user;

      if (phonenumber) {
        user = await User.findOne({ phonenumber });
      } else if (username) {
        user = await User.findOne({ username });
      } else if (email) {
        user = await User.findOne({ email });
      }

      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const payload = { username: user.username, phonenumber: user.phonenumber, email: user.email };

      jwt.sign(payload, JWT_SECRET, { expiresIn: '3000h' }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (error) {
      console.error(error instanceof Error ? error.message : 'Unknown error');
      res.status(500).send('Server error');
    }
  }

  static async getCurrentUser(req: any, res: Response) {
    try {
      const username = req.userData.username;
      const user = await User.findOne({ username });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({ message: 'User Profile', userData: user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error getting user' });
    }
  }
}

export default UserController;
