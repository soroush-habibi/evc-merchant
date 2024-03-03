import mongoose, { Model, model, Schema } from 'mongoose';
import validator from 'validator';
import { productCategoryEnum } from '../enum/productCategory.enum.js';

export interface ICategory {
    category: productCategoryEnum,
    sub: string,
    fee?: number
}

export interface ICategoryMethods { }

type CategoryModel = Model<ICategory, {}, ICategoryMethods>;

const categorySchema = new Schema<ICategory, CategoryModel, ICategoryMethods>({
    category: {
        type: String,
        enum: productCategoryEnum,
        required: true
    },
    sub: {
        type: String,
        required: true
    },
    fee: {
        type: Number,
        required: true
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
categorySchema.index({ category: 1, sub: 1 });

const Category = model<ICategory, CategoryModel>('category', categorySchema);

export { Category };