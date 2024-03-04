import mongoose, { Model, model, Schema } from 'mongoose';
import { productStatusEnum } from '../enum/productStatus.enum.js';
import validator from 'validator';
import { productCategoryEnum } from '../enum/productCategory.enum.js';

export interface IProduct {
    creator: mongoose.Schema.Types.ObjectId,
    category: productCategoryEnum,
    sub: string,
    original: boolean,
    size: string,                   //*length-width-height
    weight: number,                 //*gram
    title: string,
    photo?: string[],               //*url
    status: productStatusEnum,
    views: number,
    sales: number,
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
    category: {
        type: String,
        enum: productCategoryEnum,
        required: true
    },
    sub: {
        type: String,
        required: true
    },
    original: {
        type: Boolean,
        required: true
    },
    size: {
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
    views: {
        type: Number,
        default: 0
    },
    sales: {
        type: Number,
        default: 0
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
    timestamps: true
});

productSchema.index({ category: 1 });
productSchema.index({ views: 1 });
productSchema.index({ title: 1 }, { unique: true });
productSchema.index({ title: "text" });

const Product = model<IProduct, ProductModel>('Product', productSchema);

export { Product };