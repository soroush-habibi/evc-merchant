import mongoose, { model, Schema } from 'mongoose';
import { documentTypeEnum } from '../enum/documentType.enum.js';
import { documentStatusEnum } from '../enum/documentStatus.enum.js';
const documentSchema = new Schema({
    merchantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    type: {
        type: String,
        enum: documentTypeEnum,
        required: true
    },
    doc: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: documentStatusEnum,
        default: documentStatusEnum.PENDING
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
documentSchema.index({ merchantId: 1 });
const Document = model('Document', documentSchema);
export { Document };
