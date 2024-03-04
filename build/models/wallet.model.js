import mongoose, { model, Schema } from 'mongoose';
const walletSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true
    },
    balance: {
        type: Number,
        default: 0
    },
    pending: {
        type: Number,
        default: 0
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
walletSchema.index({ userId: 1 });
const Wallet = model('Wallet', walletSchema);
export { Wallet };
