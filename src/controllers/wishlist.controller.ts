import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import WishlistModel, { WishlistDocument } from "../model/wishlist.model";
import UserModel, { UserDocument } from "../model/User/userAuth.model"; // Assuming there's a User model to fetch user details

const JWT_SECRET_NUMBER = 9965738658; // JWT secret key as a number
const JWT_SECRET = JWT_SECRET_NUMBER.toString();

export default class WishlistController {
  async create(req: Request, res: Response) {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(" ")[1];

      if (!token) {
        return res.status(401).json({ message: "Authorization token missing" });
      }

      const decoded: any = jwt.verify(token, JWT_SECRET);

      const user = await UserModel.findOne({
        $or: [
          { username: decoded.username },
          { phonenumber: decoded.phonenumber },
          { email: decoded.email },
        ],
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (req.body.userId !== user._id.toString()) {
        return res.status(403).json({ message: "Unauthorized access" });
      }

      const wishlist = new WishlistModel(req.body);
      await wishlist.save();
      res.status(201).json({
        message: "Wishlist created successfully",
        wishlist,
      });
    } catch (err: unknown) {
      if (err instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ message: "Invalid token" });
      }
      if (err instanceof Error) {
        res.status(500).json({
          message: "Internal Server Error!",
          error: err.message,
        });
      } else {
        console.error("An unknown error occurred:", err);
        res.status(500).json({
          message: "Internal Server Error!",
        });
      }
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const wishlists = await WishlistModel.find();
      res.status(200).json({
        message: "Wishlists fetched successfully",
        wishlists,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).json({
          message: "Internal Server Error!",
          error: err.message,
        });
      } else {
        console.error("An unknown error occurred:", err);
        res.status(500).json({
          message: "Internal Server Error!",
        });
      }
    }
  }

  async findOne(req: Request, res: Response) {
    try {
      const wishlist = await WishlistModel.findById(req.params.id);
      if (!wishlist) {
        return res.status(404).json({
          message: "Wishlist not found",
        });
      }
      res.status(200).json({
        message: "Wishlist fetched successfully",
        wishlist,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).json({
          message: "Internal Server Error!",
          error: err.message,
        });
      } else {
        console.error("An unknown error occurred:", err);
        res.status(500).json({
          message: "Internal Server Error!",
        });
      }
    }
  }

  async update(req: Request, res: Response) {
    try {
      const wishlist = await WishlistModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!wishlist) {
        return res.status(404).json({
          message: "Wishlist not found",
        });
      }
      res.status(200).json({
        message: "Wishlist updated successfully",
        wishlist,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).json({
          message: "Internal Server Error!",
          error: err.message,
        });
      } else {
        console.error("An unknown error occurred:", err);
        res.status(500).json({
          message: "Internal Server Error!",
        });
      }
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const wishlist = await WishlistModel.findByIdAndDelete(req.params.id);
      if (!wishlist) {
        return res.status(404).json({
          message: "Wishlist not found",
        });
      }
      res.status(200).json({
        message: "Wishlist deleted successfully",
        wishlist,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).json({
          message: "Internal Server Error!",
          error: err.message,
        });
      } else {
        console.error("An unknown error occurred:", err);
        res.status(500).json({
          message: "Internal Server Error!",
        });
      }
    }
  }
}
