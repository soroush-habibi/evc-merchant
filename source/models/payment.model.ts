import mongoose, { Model, model, Schema } from 'mongoose';
import { paymentTypeEnum } from '../enum/payment.enum.js';
import validator from 'validator';

export interface IPayment {
    userId: mongoose.Schema.Types.ObjectId,
    type: paymentTypeEnum,
    exId: mongoose.Schema.Types.ObjectId,
    timestamp: number,
    token: string,
    done: boolean
}

export interface IPaymentMethods { }

type PaymentModel = Model<IPayment, {}, IPaymentMethods>;

const paymentSchema = new Schema<IPayment, PaymentModel, IPaymentMethods>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    type: {
        type: String,
        enum: paymentTypeEnum,
        required: true
    },
    exId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    timestamp: {
        type: Number,
        validate: {
            validator: (value: number) => {
                return /^\d{10,13}$/.test(String(value));
            },
            message: "invalid timestamp"
        },
        required: true
    },
    token: {                                                    //todo:add validation
        type: String,
        required: true
    },
    done: {
        type: Boolean,
        default: false
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

paymentSchema.index({ userId: 1 });

const Payment = model<IPayment, PaymentModel>('Payment', paymentSchema);

export { Payment };