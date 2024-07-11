import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import UserModel from '../model/User/userAuth.model'; // Adjust the import path as needed

const JWT_SECRET = '9965738658'; // Replace with your JWT secret

// Extend the Request interface to include userData
declare global {
  namespace Express {
    interface Request {
      userData?: { userId: string; username: string }; // Adjust according to the token payload
    }
  }
}

async function authUserMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header is missing' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authorization token is missing' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; username: string };
    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    if (user.username !== decoded.username) {
      return res.status(401).json({ message: 'Username mismatch' });
    }

    req.userData = decoded;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
}

export default authUserMiddleware;
