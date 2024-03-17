import mongoose, { Model, model, Schema } from 'mongoose';
import validator from 'validator';
import { gatewayStatusEnum } from '../enum/gatewayStatus.enum.js';

export interface IGateway {
    merchantId: mongoose.Schema.Types.ObjectId,
    timestamp: number,
    callback: string,
    amount: number,
    paymentId: mongoose.Schema.Types.ObjectId,
    status: gatewayStatusEnum,
    createdAt: Date,
    updatedAt: Date
}

export interface IGatewayMethods { }

type GatewayModel = Model<IGateway, {}, IGatewayMethods>;

const gatewaySchema = new Schema<IGateway, GatewayModel, IGatewayMethods>({
    merchantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    timestamp: {
        type: Number,
        unique: true,
        validate: {
            validator: (value: number) => {
                return /^\d{10,13}$/.test(String(value));
            },
            message: "invalid timestamp"
        },
        required: true
    },
    callback: {
        type: String,
        validate: [validator.isURL, "invalid url"]
    },
    amount: {
        type: Number,
        required: true
    },
    paymentId: {
        type: mongoose.Schema.Types.ObjectId
    },
    status: {
        type: String,
        enum: gatewayStatusEnum,
        default: gatewayStatusEnum.INIT
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

gatewaySchema.index({ userId: 1 });

const Gateway = model<IGateway, GatewayModel>('Gateway', gatewaySchema);

export { Gateway };