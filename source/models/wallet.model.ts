import mongoose, { Model, model, Schema } from 'mongoose';
import validator from 'validator';

export interface IWallet {
    userId: mongoose.Schema.Types.ObjectId,
    balance: number,
    pending: number,
}

export interface IWalletMethods { }

type WalletModel = Model<IWallet, {}, IWalletMethods>;

const walletSchema = new Schema<IWallet, WalletModel, IWalletMethods>({
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
});

walletSchema.index({ userId: 1 });

const Wallet = model<IWallet, WalletModel>('Wallet', walletSchema);

export { Wallet };