import { CustomErrorClass } from "../utils/customError.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";
import { Document } from "../models/document.model.js";
import { documentStatusEnum } from "../enum/documentStatus.enum.js";
import { Category } from "../models/category.model.js";
import mongoose from "mongoose";
import { Store } from "../models/store.model.js";
import { Order } from "../models/order.model.js";
const ENV = process.env.PRODUCTION;
export default class adminController {
    static async getAdminProducts(req, res, next) {
        const query = req.query;
        try {
            const filter = {
                title: {
                    $regex: query.title ? new RegExp(query.title, "i") : ""
                }, category: {
                    $regex: query.category ? new RegExp(query.category, "i") : ""
                }
            };
            if (query.status !== undefined)
                filter.status = query.status;
            const results = await Product.find(filter, {}, { limit: 20, skip: query.page ? (query.page - 1) * 20 : 0 });
            res.status(200).json({
                message: "products list",
                data: results
            });
        }
        catch (e) {
            next(e);
        }
    }
    static async updateProductStatus(req, res, next) {
        const query = req.query;
        let session;
        try {
            session = await mongoose.startSession();
            session.startTransaction();
        }
        catch (e) {
            return next(e);
        }
        try {
            const product = await Product.findById(query.productId);
            if (!product)
                return next(CustomErrorClass.productNotFound());
            product.status = query.newStatus;
            await product.save({ session });
            let category = await Category.findOne({
                category: product.category,
                sub: product.sub
            });
            if (!category) {
                if (!query.fee)
                    throw CustomErrorClass.feeRequired();
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
        }
        catch (e) {
            await session.abortTransaction();
            return next(e);
        }
    }
    static async checkDocument(req, res, next) {
        const query = req.query;
        try {
            const document = await Document.findById(query.documentId);
            if (!document)
                return next(CustomErrorClass.documentNotFound());
            const newDoc = { status: query.newStatus };
            if (query.message) {
                newDoc.message = query.message;
            }
            else {
                if (query.newStatus === documentStatusEnum.VERIFIED) {
                    newDoc.message = "مدرک شما تایید شد!";
                }
            }
            await document.updateOne({ $set: newDoc });
            res.status(201).json({
                message: "status changed"
            });
        }
        catch (e) {
            return next(e);
        }
    }
    static async getUsers(req, res, next) {
        const query = req.query;
        try {
            const filter = {};
            if (query.phoneNumber)
                filter.phoneNumber = { $regex: new RegExp(query.phoneNumber, "i") };
            if (query.fullName)
                filter.fullName = { $regex: new RegExp(query.fullName, "i") };
            if (query.nationalCode)
                filter.nationalCode = { $regex: new RegExp(query.nationalCode, "i") };
            const users = await User.aggregate([
                {
                    $match: filter
                },
                {
                    $lookup: {
                        from: "stores",
                        localField: "_id",
                        foreignField: "merchantId",
                        as: "store"
                    }
                },
                {
                    $unwind: "$store"
                },
                {
                    $project: {
                        password: 0,
                        refreshToken: 0
                    }
                },
                {
                    $limit: 10
                },
                {
                    $skip: query.page ? (query.page - 1) * 10 : 0
                }
            ]);
            res.status(200).json({
                message: "users list",
                data: users
            });
        }
        catch (e) {
            return next(e);
        }
    }
    static async verifyUser(req, res, next) {
        const body = req.body;
        try {
            const user = await User.findOne({ phoneNumber: body.phoneNumber });
            if (!user)
                return next(CustomErrorClass.userNotFound());
            user.status = body.newStatus;
            if (body.message) {
                user.message = body.message;
            }
            else {
                user.message = undefined;
            }
            await user.save();
            res.status(201).json({
                message: "user updated!"
            });
        }
        catch (e) {
            return next(e);
        }
    }
    static async verifyStore(req, res, next) {
        const body = req.body;
        try {
            const user = await User.findOne({ phoneNumber: body.phoneNumber });
            if (!user)
                return next(CustomErrorClass.userNotFound());
            const store = await Store.findOne({ merchantId: user.id });
            if (!store)
                return next(CustomErrorClass.storeNotFound());
            store.status = body.newStatus;
            if (body.message) {
                store.message = body.message;
            }
            else {
                store.message = undefined;
            }
            await store.save();
            res.status(201).json({
                message: "store updated!"
            });
        }
        catch (e) {
            return next(e);
        }
    }
    static async getOrders(req, res, next) {
        const query = req.query;
        try {
            const filter = {};
            if (query.merchantPhoneNumber)
                filter["merchant.phoneNumber"] = query.merchantPhoneNumber;
            if (query.status)
                filter.status = query.status;
            const orders = await Order.aggregate([
                {
                    $lookup: {
                        from: 'users',
                        localField: 'merchantId',
                        foreignField: '_id',
                        as: 'merchant'
                    }
                },
                {
                    $unwind: "$merchant"
                },
                {
                    $match: filter
                },
                {
                    $limit: 20
                },
                {
                    $skip: query.page ? (query.page - 1) * 20 : 0
                },
                {
                    $project: {
                        "merchant.password": 0,
                        "merchant.refreshToken": 0,
                        "merchant._id": 0,
                        "merchant.__v": 0
                    }
                }
            ]);
            res.status(200).json({
                message: "orders list:",
                data: orders
            });
        }
        catch (e) {
            return next(e);
        }
    }
    static async verifyDocumentUrl(req, res, next) {
        const query = req.query;
        try {
            const document = await Document.findOne({ doc: query.url });
            if (!document)
                return next(CustomErrorClass.documentNotFound());
            res.status(200).json({
                message: "ok"
            });
        }
        catch (e) {
            return next(e);
        }
    }
}
