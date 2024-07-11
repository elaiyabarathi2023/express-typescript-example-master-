import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import OrderModel, { OrderDocument } from "../model/order.model";
import CartModel from "../model/cart.modal";
import ProductModel from "../model/productDetails.model";
import UserModel, { UserDocument } from "../model/User/userAuth.model";



const JWT_SECRET_NUMBER = 9965738658; // JWT secret key as a number
const JWT_SECRET = JWT_SECRET_NUMBER.toString();

export default class OrderController {
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

      const cart = await CartModel.findOne({ userId: user._id });
      if (!cart || cart.products.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }

      let totalAmount = 0;
      for (const cartProduct of cart.products) {
        const product = await ProductModel.findById(cartProduct.productId);
        if (!product) {
          return res.status(404).json({ message: `Product not found: ${cartProduct.productId}` });
        }
        if (product.quantity < cartProduct.quantity) {
          return res.status(400).json({ message: `Insufficient stock for product: ${product.name}` });
        }
        totalAmount += product.price * cartProduct.quantity;
      }

      for (const cartProduct of cart.products) {
        const product = await ProductModel.findById(cartProduct.productId);
        if (product) {
          product.quantity -= cartProduct.quantity; // Access quantity property here
          await product.save();
        }
      }

      const order = new OrderModel({
        userId: user._id,
        products: cart.products,
        totalAmount,
        status: 'ordered',
      });
      await order.save();
      await CartModel.findByIdAndDelete(cart._id);

      res.status(201).json({
        message: "Order created successfully",
        order,
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

  // Other methods remain unchanged



  async findAll(req: Request, res: Response) {
    try {
      const orders = await OrderModel.find();
      res.status(200).json({
        message: "Orders fetched successfully",
        orders,
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
      const order = await OrderModel.findById(req.params.id);
      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }
      res.status(200).json({
        message: "Order fetched successfully",
        order,
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
      const { status } = req.body;
      if (status !== 'ordered' && status !== 'cancelled') {
        return res.status(400).json({ message: "Invalid status update" });
      }

      const order = await OrderModel.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );
      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }
      res.status(200).json({
        message: "Order updated successfully",
        order,
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
      const order = await OrderModel.findByIdAndDelete(req.params.id);
      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }
      res.status(200).json({
        message: "Order deleted successfully",
        order,
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
