import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import CartModel, { CartDocument } from "../model/cart.modal";
import UserModel, { UserDocument } from "../model/User/userAuth.model";

const JWT_SECRET_NUMBER = 9965738658; // JWT secret key as a number
const JWT_SECRET = JWT_SECRET_NUMBER.toString();

export default class CartController {
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

      const cart = new CartModel(req.body);
      await cart.save();
      res.status(201).json({
        message: "Cart created successfully",
        cart,
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
      const carts = await CartModel.find();
      res.status(200).json({
        message: "Carts fetched successfully",
        carts,
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
      const cart = await CartModel.findById(req.params.id);
      if (!cart) {
        return res.status(404).json({
          message: "Cart not found",
        });
      }
      res.status(200).json({
        message: "Cart fetched successfully",
        cart,
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
      const cart = await CartModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!cart) {
        return res.status(404).json({
          message: "Cart not found",
        });
      }
      res.status(200).json({
        message: "Cart updated successfully",
        cart,
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
      const cart = await CartModel.findByIdAndDelete(req.params.id);
      if (!cart) {
        return res.status(404).json({
          message: "Cart not found",
        });
      }
      res.status(200).json({
        message: "Cart deleted successfully",
        cart,
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
