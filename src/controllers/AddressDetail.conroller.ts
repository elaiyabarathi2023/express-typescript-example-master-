import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import AddressDetailModel, { AddressDetailDocument } from "../model/AddressDetail.model";
import UserModel, { UserDocument } from "../model/User/userAuth.model"; // Assuming there's a User model to fetch user details

const JWT_SECRET_NUMBER = 9965738658; // JWT secret key as a number
const JWT_SECRET = JWT_SECRET_NUMBER.toString();




export default class AddressDetailController {
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

      const addressDetail = new AddressDetailModel(req.body);
      await addressDetail.save();
      res.status(201).json({
        message: "Address detail created successfully",
        addressDetail,
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
      const addressDetails = await AddressDetailModel.find();
      res.status(200).json({
        message: "Address details fetched successfully",
        addressDetails,
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
      const addressDetail = await AddressDetailModel.findById(req.params.id);
      if (!addressDetail) {
        return res.status(404).json({
          message: "Address detail not found",
        });
      }
      res.status(200).json({
        message: "Address detail fetched successfully",
        addressDetail,
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
      const addressDetail = await AddressDetailModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!addressDetail) {
        return res.status(404).json({
          message: "Address detail not found",
        });
      }
      res.status(200).json({
        message: "Address detail updated successfully",
        addressDetail,
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
      const addressDetail = await AddressDetailModel.findByIdAndDelete(
        req.params.id
      );
      if (!addressDetail) {
        return res.status(404).json({
          message: "Address detail not found",
        });
      }
      res.status(200).json({
        message: "Address detail deleted successfully",
        addressDetail,
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