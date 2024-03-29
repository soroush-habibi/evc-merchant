import { model, Schema } from 'mongoose';
import { productCategoryEnum } from '../enum/productCategory.enum.js';
const categorySchema = new Schema({
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
categorySchema.index({ category: 1, sub: 1 });
const Category = model('category', categorySchema);
export { Category };
