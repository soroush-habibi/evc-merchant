import mongoose, { Model, model, Schema } from 'mongoose';
import { inventoryStatusEnum } from '../enum/inventoryStatus.enum.js';
import validator from 'validator';

export interface IInventory {
    merchantId: mongoose.Schema.Types.ObjectId,
    productId: mongoose.Schema.Types.ObjectId,
    price: number,
    count: number,
    status: inventoryStatusEnum
}

export interface IInventoryMethods { }

type InventoryModel = Model<IInventory, {}, IInventoryMethods>;

const inventorySchema = new Schema<IInventory, InventoryModel, IInventoryMethods>({
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
    timestamps: true
});
inventorySchema.index({ productId: 1 });

const Inventory = model<IInventory, InventoryModel>('Inventory', inventorySchema);

export { Inventory };