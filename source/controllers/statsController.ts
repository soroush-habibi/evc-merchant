import { NextFunction, Request, Response } from "express";
import { CustomErrorClass } from "../utils/customError.js";
import { addCommentDtoType, deleteCommentDtoType, getMerchantStatsDtoType, getProductCommentsDtoType, getProductStatsDtoType } from "../dtos/stats.dto.js";
import { Inventory } from "../models/inventory.model.js";
import { Order } from "../models/order.model.js";
import { orderStatusEnum } from "../enum/orderStatus.enum.js";
import { Comment } from "../models/comment.model.js";
import mongoose from "mongoose";

export default class statsController {
    static async addComment(req: Request, res: Response, next: NextFunction) {
        const body = req.body as addCommentDtoType;

        try {
            const order = await Order.findById(body.orderId);
            if (!order) return next(CustomErrorClass.orderNotFound());
            if (order.status !== orderStatusEnum.RECEIVED) return next(CustomErrorClass.orderNotReceived());
            let inventoryIds: string[] = [];
            for (let i of order.items) {
                inventoryIds.push(String(i.inventoryId));
            }
            if (!inventoryIds.includes(body.inventoryId)) return next(CustomErrorClass.noMatch());
            const inventory = await Inventory.findById(body.inventoryId);
            if (!inventory) return next(CustomErrorClass.inventoryNotFound());
            let comment = await Comment.findOne({ orderId: body.orderId, userId: order.userId, inventoryId: body.inventoryId, productId: inventory.productId });

            if (comment) {
                const tempTime = comment.createdAt.getTime() + (1000 * 60 * 60 * 24 * 7);
                if (Date.now() > tempTime) return next(CustomErrorClass.timeout());
                comment.title = body.title;
                comment.context = body.context;
                comment.pros = body.pros;
                comment.cons = body.cons;
                comment.rate = body.rate;
                comment.suggest = body.suggest;

                await comment.save();
            } else {
                comment = new Comment({
                    orderId: body.orderId,
                    userId: order.userId,
                    inventoryId: body.inventoryId,
                    productId: inventory.productId,
                    title: body.title,
                    context: body.context,
                    pros: body.pros,
                    cons: body.cons,
                    rate: body.rate,
                    suggest: body.suggest
                });

                await comment.save();
            }

            res.status(201).json({
                message: "comment saved!"
            });
        } catch (e) {
            return next(e);
        }
    }

    static async deleteComment(req: Request, res: Response, next: NextFunction) {
        const query = req.query as deleteCommentDtoType;

        try {
            const comment = await Comment.findOne({ _id: query.commentId, userId: query.userId });
            if (!comment) return next(CustomErrorClass.commentNotFound());

            await comment.deleteOne();

            res.status(201).json({
                message: "comment deleted!"
            });
        } catch (e) {
            return next(e);
        }
    }

    static async getProductComments(req: Request, res: Response, next: NextFunction) {
        const query = req.query as getProductCommentsDtoType;

        try {
            const comments = await Comment.aggregate([
                {
                    $lookup: {
                        from: "inventories",
                        localField: "inventoryId",
                        foreignField: "_id",
                        as: "inventory"
                    }
                },
                {
                    $lookup: {
                        from: "stores",
                        localField: "inventory.merchantId",
                        foreignField: "merchantId",
                        as: "store"
                    }
                },
                {
                    $unwind: "$inventory"
                },
                {
                    $unwind: "$store"
                },
                {
                    $match: {
                        "inventory.productId": new mongoose.Types.ObjectId(query.productId)
                    }
                }
            ]);

            res.status(200).json({
                message: "comments:",
                data: comments
            });
        } catch (e) {
            return next(e);
        }
    }

    static async getProductStats(req: Request, res: Response, next: NextFunction) {
        const query = req.query as getProductStatsDtoType;

        try {
            const result = await Comment.aggregate([
                {
                    $match: {
                        productId: new mongoose.Types.ObjectId(query.productId)
                    }
                },
                {
                    $group: {
                        _id: "$productId",
                        avgRate: { $avg: "$rate" },
                        totalComments: { $sum: 1 },
                        suggestTrueCount: { $sum: { $cond: { if: { $eq: ["$suggest", true] }, then: 1, else: 0 } } }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        avgRate: 1,
                        suggestTruePercentage: { $multiply: [{ $divide: ["$suggestTrueCount", "$totalComments"] }, 100] },
                        totalComments: 1,
                    }
                }
            ]);

            res.status(200).json({
                message: "product stats",
                data: result[0]
            });
        } catch (e) {
            return next(e);
        }
    }

    static async getMerchantStats(req: Request, res: Response, next: NextFunction) {
        const query = req.query as getMerchantStatsDtoType;

        try {
            const result = await Comment.aggregate([
                {
                    $lookup: {
                        from: "inventories",
                        localField: "inventoryId",
                        foreignField: "_id",
                        as: "inventory"
                    }
                },
                {
                    $unwind: "$inventory"
                },
                {
                    $match: {
                        "inventory.merchantId": new mongoose.Types.ObjectId(query.merchantId)
                    }
                },
                {
                    $group: {
                        _id: null,
                        avgRate: { $avg: "$rate" },
                        totalComments: { $sum: 1 },
                        suggestTrueCount: { $sum: { $cond: { if: { $eq: ["$suggest", true] }, then: 1, else: 0 } } }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        avgRate: 1,
                        suggestTruePercentage: { $multiply: [{ $divide: ["$suggestTrueCount", "$totalComments"] }, 100] },
                        totalComments: 1,
                    }
                }
            ]);

            res.status(200).json({
                message: "merchant stats",
                data: result
            });
        } catch (e) {
            return next(e);
        }
    }
}