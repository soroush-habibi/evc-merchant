import { CustomErrorClass } from "../utils/customError.js";
import { Inventory } from "../models/inventory.model.js";
import { Order } from "../models/order.model.js";
import { orderStatusEnum } from "../enum/orderStatus.enum.js";
import { Comment } from "../models/comment.model.js";
import mongoose from "mongoose";
export default class statsController {
    static async addComment(req, res, next) {
        const body = req.body;
        try {
            const order = await Order.findById(body.orderId);
            if (!order)
                return next(CustomErrorClass.orderNotFound());
            if (order.status !== orderStatusEnum.RECEIVED)
                return next(CustomErrorClass.orderNotReceived());
            let inventoryIds = [];
            for (let i of order.items) {
                inventoryIds.push(String(i.inventoryId));
            }
            if (!inventoryIds.includes(body.inventoryId))
                return next(CustomErrorClass.noMatch());
            const inventory = await Inventory.findById(body.inventoryId);
            if (!inventory)
                return next(CustomErrorClass.inventoryNotFound());
            let comment = await Comment.findOne({ orderId: body.orderId, userId: order.userId, inventoryId: body.inventoryId });
            if (comment) {
                const tempTime = comment.createdAt.getTime() + (1000 * 60 * 60 * 24 * 7);
                if (Date.now() > tempTime)
                    return next(CustomErrorClass.timeout());
                comment.title = body.title;
                comment.context = body.context;
                comment.pros = body.pros;
                comment.cons = body.cons;
                comment.rate = body.rate;
                comment.suggest = body.suggest;
                await comment.save();
            }
            else {
                comment = new Comment({
                    orderId: body.orderId,
                    userId: order.userId,
                    inventoryId: body.inventoryId,
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
        }
        catch (e) {
            return next(e);
        }
    }
    static async deleteComment(req, res, next) {
        const query = req.query;
        try {
            const comment = await Comment.findOne({ _id: query.commentId, userId: query.userId });
            if (!comment)
                return next(CustomErrorClass.commentNotFound());
            await comment.deleteOne();
            res.status(201).json({
                message: "comment deleted!"
            });
        }
        catch (e) {
            return next(e);
        }
    }
    static async getProductComments(req, res, next) {
        const query = req.query;
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
                    $match: {
                        "inventory.productId": new mongoose.Types.ObjectId(query.productId)
                    }
                }
            ]);
            res.status(200).json({
                message: "comments:",
                data: comments
            });
        }
        catch (e) {
            return next(e);
        }
    }
}
