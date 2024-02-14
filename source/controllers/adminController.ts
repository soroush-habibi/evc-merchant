import { NextFunction, Request, Response } from "express";
import { CustomErrorClass } from "../utils/customError.js";
import { getAdminProductsDtoType, getUsersDtoType, updateProductStatusDtoType } from "../dtos/admin.dto.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";

const ENV = process.env.PRODUCTION

export default class adminController {
    static async getAdminProducts(req: Request, res: Response, next: NextFunction) {
        const query = req.query as getAdminProductsDtoType;

        try {
            const filter: any = {
                title: {
                    $regex: query.title ? new RegExp(query.title, "i") : ""
                }, category: {
                    $regex: query.category ? new RegExp(query.category, "i") : ""
                }
            }

            if (query.status !== undefined) filter.status = query.status

            const results = await Product.find(filter, {}, { limit: 20, skip: query.page ? (query.page - 1) * 20 : 0 });

            res.status(200).json({
                message: "products list",
                data: results
            });
        } catch (e) {
            next(e);
        }
    }

    static async updateProductStatus(req: Request, res: Response, next: NextFunction) {
        const query = req.query as updateProductStatusDtoType;

        try {
            const product = await Product.findById(query.productId);

            if (!product) return next(CustomErrorClass.productNotFound());

            await product.updateOne({ status: query.newStatus });

            res.status(201).json({
                message: "status updated"
            });
        } catch (e) {
            return next(e);
        }
    }

    static async getUsers(req: Request, res: Response, next: NextFunction) {
        const query = req.query as getUsersDtoType;

        try {
            const filter: any = {
                phoneNumber: {
                    $regex: query.phoneNumber ? new RegExp(query.phoneNumber, "i") : ""
                }, fullName: {
                    $regex: query.fullName ? new RegExp(query.fullName, "i") : ""
                }, nationalCode: {
                    $regex: query.nationalCode ? new RegExp(query.nationalCode, "i") : ""
                }
            }

            const users = await User.find(filter, {}, {
                limit: 10,
                skip: query.page ? (query.page - 1) * 10 : 0
            });

            res.status(200).json({
                message: "users list",
                data: users
            });
        } catch (e) {
            return next(e);
        }
    }
}