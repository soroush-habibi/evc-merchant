import mongoose, { model, Schema } from 'mongoose';
const commentSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    inventoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Inventory",
        required: true
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    context: {
        type: String,
        required: true
    },
    pros: {
        type: [String],
        default: []
    },
    cons: {
        type: [String],
        default: []
    },
    rate: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    suggest: {
        type: Boolean,
        required: true
    },
    like: {
        type: Number,
        default: 0
    },
    dislike: {
        type: Number,
        default: 0
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
commentSchema.index({ userId: 1 });
commentSchema.index({ inventoryId: 1 });
const Comment = model('Comment', commentSchema);
export { Comment };
