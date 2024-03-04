import mongoose, { Model, model, Schema } from 'mongoose';
import validator from 'validator';

export interface IComment {
    userId: mongoose.Schema.Types.ObjectId,
    inventoryId: mongoose.Schema.Types.ObjectId,
    orderId: mongoose.Schema.Types.ObjectId,
    title: string,
    context: string,
    pros: string[],
    cons: string[],
    rate: number,
    suggest: boolean,
    like: number,
    dislike: number,
    createdAt: Date,
    updatedAt: Date
}

export interface ICommentMethods { }

type CommentModel = Model<IComment, {}, ICommentMethods>;

const commentSchema = new Schema<IComment, CommentModel, ICommentMethods>({
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

const Comment = model<IComment, CommentModel>('Comment', commentSchema);

export { Comment };