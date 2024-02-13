import mongoose, { model, Schema } from 'mongoose';
import { inventoryStatusEnum } from '../enum/inventoryStatus.enum.js';
const inventorySchema = new Schema({
    merchantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 10000
    },
    count: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: inventoryStatusEnum,
        default: inventoryStatusEnum.ACTIVE
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
inventorySchema.index({ productId: 1 });
const Inventory = model('Inventory', inventorySchema);
export { Inventory };
