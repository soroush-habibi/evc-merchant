import mongoose, { model, Schema } from 'mongoose';
import { paymentTypeEnum } from '../enum/payment.enum.js';
const paymentSchema = new Schema({
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
        unique: true,
        validate: {
            validator: (value) => {
                return /^\d{10,13}$/.test(String(value));
            },
            message: "invalid timestamp"
        },
        required: true
    },
    token: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
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
    timestamps: true
});
paymentSchema.index({ userId: 1 });
paymentSchema.index({ timestamp: 1 });
const Payment = model('Payment', paymentSchema);
export { Payment };
