import { CustomErrorClass } from "../utils/customError.js";
import { Inventory } from "../models/inventory.model.js";
import { Order } from "../models/order.model.js";
import { orderStatusEnum } from "../enum/orderStatus.enum.js";
import { Comment } from "../models/comment.model.js";
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
}
