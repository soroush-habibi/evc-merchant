import mongoose, { model, Schema } from 'mongoose';
import { orderStatusEnum } from "../enum/orderStatus.enum.js";
const orderSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    items: [{
            inventoryId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Inventory",
                required: true
            },
            count: {
                type: Number,
                required: true
            }
        }],
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
orderSchema.index({ userId: 1 });
const Order = model('Order', orderSchema);
export { Order };
