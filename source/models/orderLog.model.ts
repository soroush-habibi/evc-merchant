import mongoose, { Model, model, Schema } from 'mongoose';
import { orderStatusEnum } from "../enum/orderStatus.enum.js";
import validator from 'validator';

export interface IOrderLog {
    orderId: mongoose.Schema.Types.ObjectId,
    from: orderStatusEnum,
    to: orderStatusEnum,
    date: Date
}

export interface IOrderLogMethods { }

type OrderLogModel = Model<IOrderLog, {}, IOrderLogMethods>;

const orderLogSchema = new Schema<IOrderLog, OrderLogModel, IOrderLogMethods>({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Order"
    },
    from: {
        type: String,
        required: true,
        enum: orderStatusEnum
    },
    to: {
        type: String,
        required: true,
        enum: orderStatusEnum
    },
    date: {
        type: Date,
        default: new Date()
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

const OrderLog = model<IOrderLog, OrderLogModel>('OrderLog', orderLogSchema);

export { OrderLog };