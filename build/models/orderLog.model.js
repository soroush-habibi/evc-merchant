import mongoose, { model, Schema } from 'mongoose';
import { orderStatusEnum } from "../enum/orderStatus.enum.js";
const orderLogSchema = new Schema({
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
    createdAt: {
        type: Date
    },
    updatedAt: {
        type: Date
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
    timestamps: true
});
const OrderLog = model('OrderLog', orderLogSchema);
export { OrderLog };
