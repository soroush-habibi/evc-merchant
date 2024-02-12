import mongoose, { Model, model, Schema } from 'mongoose';
import { productStatusEnum } from '../enum/productStatus.enum.js';
import validator from 'validator';

export interface IProduct {
    creator: mongoose.Schema.Types.ObjectId,
    category: string,
    original: boolean,
    size: string,                   //*length-width-height
    weight: number,                 //*gram
    title: string,
    photo?: string[],               //*url
    status: productStatusEnum,
    addData: string
}

export interface IProductMethods { }

type ProductModel = Model<IProduct, {}, IProductMethods>;

const productSchema = new Schema<IProduct, ProductModel, IProductMethods>({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    category: {                                             //todo:validating category by another database collection
        type: String,
        required: true
    },
    original: {
        type: Boolean,
        required: true
    },
    size: {                                                //todo:validation in mongoose
        type: String,
        required: true,
        validate: {
            validator: function (value: string) {
                return /^\d+-\d+-\d+$/.test(value);
            },
            message: "invalid size format"
        }
    },
    weight: {
        type: Number,
        required: true
    },
    title: {
        type: String,//*gram
        required: true
    },
    photo: {
        type: [String],
        default: []
    },
    status: {
        type: String,
        enum: productStatusEnum,
        default: productStatusEnum.UNVERIFIED
    },
    addData: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
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

productSchema.index({ category: 1 });

productSchema.index({ title: 1 }, { unique: true });

const Product = model<IProduct, ProductModel>('Product', productSchema);

export { Product };