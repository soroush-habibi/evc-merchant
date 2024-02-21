import mongoose, { Model, model, Schema } from 'mongoose';
import { orderStatusEnum } from "../enum/orderStatus.enum.js";
import validator from 'validator';

export interface IOrder {
    userId: mongoose.Schema.Types.ObjectId,
    inventoryIds: mongoose.Schema.Types.ObjectId[],
    status: orderStatusEnum
}

export interface IOrderMethods { }

type OrderModel = Model<IOrder, {}, IOrderMethods>;

const orderSchema = new Schema<IOrder, OrderModel, IOrderMethods>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    inventoryIds: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        ref: "Inventory"
    },
    status: {
        type: String,
        enum: orderStatusEnum,
        default: orderStatusEnum.CART
    }
}, {
    toJSON: {
        // convert _id to id
        virtuals: true,
        // remove __v
        versionKey: false,
        // remove _id 
        transform: function (doc, ret) {
            delete ret._id;
            // delete ret.__v;
        }
    },
});

const Order = model<IOrder, OrderModel>('Order', orderSchema);

export { Order };