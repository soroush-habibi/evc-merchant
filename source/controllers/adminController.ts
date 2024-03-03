import { NextFunction, Request, Response } from "express";
import { CustomErrorClass } from "../utils/customError.js";
import { checkDocumentDtoType, getAdminProductsDtoType, getUsersDtoType, updateProductStatusDtoType, verifyUserDtoType } from "../dtos/admin.dto.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";
import { Document } from "../models/document.model.js";
import { documentStatusEnum } from "../enum/documentStatus.enum.js";
import { Category } from "../models/category.model.js";
import mongoose from "mongoose";

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

        let session;

        try {
            session = await mongoose.startSession();
            session.startTransaction();
        } catch (e) {
            return next(e);
        }

        try {
            const product = await Product.findById(query.productId);

            if (!product) return next(CustomErrorClass.productNotFound());

            product.status = query.newStatus;
            await product.save({ session });
            let category = await Category.findOne({
                category: product.category,
                sub: product.sub
            });

            if (!category) {
                if (!query.fee) throw CustomErrorClass.feeRequired();
                category = new Category({
                    category: product.category,
                    sub: query.newSub ? query.newSub : product.sub,
                    fee: query.fee
                });

                await category.save({ session });

                product.sub = category.sub;
                await product.save({ session });
            }

            await session.commitTransaction();

            res.status(201).json({
                message: "status updated"
            });
        } catch (e) {
            await session.abortTransaction();
            return next(e);
        }
    }

    static async checkDocument(req: Request, res: Response, next: NextFunction) {
        const query = req.query as checkDocumentDtoType;

        try {
            const document = await Document.findById(query.documentId);

            if (!document) return next(CustomErrorClass.documentNotFound());

            const newDoc: any = { status: query.newStatus }

            if (query.message) {
                newDoc.message = query.message
            } else {
                if (query.newStatus === documentStatusEnum.VERIFIED) {
                    newDoc.message = "مدرک شما تایید شد!";
                }
            }

            await document.updateOne({ $set: newDoc });

            res.status(201).json({
                message: "status changed"
            });
        } catch (e) {
            return next(e);
        }
    }

    static async getUsers(req: Request, res: Response, next: NextFunction) {
        const query = req.query as getUsersDtoType;

        try {
            const filter: any = {}

            if (query.phoneNumber) filter.phoneNumber = { $regex: new RegExp(query.phoneNumber, "i") }
            if (query.fullName) filter.fullName = { $regex: new RegExp(query.fullName, "i") }
            if (query.nationalCode) filter.nationalCode = { $regex: new RegExp(query.nationalCode, "i") }

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

    static async verifyUser(req: Request, res: Response, next: NextFunction) {
        const body = req.body as verifyUserDtoType;

        try {
            const user = await User.findOne({ phoneNumber: body.phoneNumber });
            if (!user) return next(CustomErrorClass.userNotFound());

            user.status = body.newStatus;
            if (body.message) {
                user.message = body.message;
            } else {
                user.message = undefined;
            }
            await user.save();

            res.status(201).json({
                message: "user updated!"
            });
        } catch (e) {
            return next(e);
        }
    }
}