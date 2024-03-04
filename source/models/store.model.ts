import mongoose, { Model, model, Schema } from 'mongoose';
import { storeStatusEnum } from '../enum/storeStatus.enum.js';
import validator from 'validator';

export interface IStore {
    merchantId: mongoose.Schema.Types.ObjectId,
    name: string,
    about: string,
    phoneNumber: string,
    logo: string,
    website: string,
    status: storeStatusEnum,
    message?: string,
    createdAt: Date,
    updatedAt: Date
}

export interface IStoreMethods { }

type StoreModel = Model<IStore, {}, IStoreMethods>;

const storeSchema = new Schema<IStore, StoreModel, IStoreMethods>({
    merchantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        required: true,
        minlength: 2
    },
    about: {
        type: String,
    },
    phoneNumber: {
        type: String,
        validate: {
            validator: (value: any) => {
                return /^0\d{2,3}\d{8}$/.test(value);
            },
            message: "not valid telephone number"
        }
    },
    logo: {
        type: String
    },
    website: {
        type: String,
        validate: [validator.isURL, "not valid url"]
    },
    status: {
        type: String,
        enum: storeStatusEnum,
        default: storeStatusEnum.UNVERIFIED
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
storeSchema.index({ name: 1 }, { unique: true });
storeSchema.index({ merchantId: 1 }, { unique: true });

const Store = model<IStore, StoreModel>('Store', storeSchema);

export { Store };