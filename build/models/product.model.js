import mongoose, { model, Schema } from 'mongoose';
const productSchema = new Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    category: {
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
            validator: function (value) {
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
        type: String,
        required: true
    },
    photo: {
        type: [String],
        default: []
    },
    verified: {
        type: Boolean,
        default: false
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
const Product = model('Product', productSchema);
export { Product };
