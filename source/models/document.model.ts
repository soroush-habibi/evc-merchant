import mongoose, { Model, model, Schema } from 'mongoose';
import validator from 'validator';
import { documentTypeEnum } from '../enum/documentType.enum.js';
import { documentStatusEnum } from '../enum/documentStatus.enum.js';

export interface IDocument {
    merchantId: mongoose.Schema.Types.ObjectId,
    type: documentTypeEnum,
    doc: string,
    status: documentStatusEnum,
    message: string,
    createdAt: Date,
    updatedAt: Date
}

export interface IDocumentMethods { }

type DocumentModel = Model<IDocument, {}, IDocumentMethods>;

const documentSchema = new Schema<IDocument, DocumentModel, IDocumentMethods>({
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
    },
    message: {
        type: String
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
documentSchema.index({ merchantId: 1 });

const Document = model<IDocument, DocumentModel>('Document', documentSchema);

export { Document };