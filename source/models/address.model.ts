import mongoose, { Model, model, Schema } from 'mongoose';
import { statesEnum } from '../enum/states.enum.js';
import validator from 'validator';

const latitudeRegex = /^-?([1-8]?[0-9](\.[0-9]+)?|90(\.0+)?)$/;
const longitudeRegex = /^-?((1?[0-7]?|[1-9]?[0-9])(\.[0-9]+)?|180(\.0+)?)$/;
const postcodeRegex = /^\d{10}$/;
const phoneRegex = /^09[0-9]{9}$/;

export interface IAddress {
    phoneNumber: String,
    longitude?: string,
    latitude?: string,
    state: statesEnum,
    city: string,
    address: string,
    number?: number,
    postCode: string,
    public: boolean,
    createdAt: Date,
    updatedAt: Date
}

export interface IAddressMethods { }

type AddressModel = Model<IAddress, {}, IAddressMethods>;

const addressSchema = new Schema<IAddress, AddressModel, IAddressMethods>({
    phoneNumber: {
        type: String,
        match: [phoneRegex, "invalid phone number"],
        required: true
    },
    longitude: {
        type: String,
        match: [longitudeRegex, "invalid longitude"]
    },
    latitude: {
        type: String,
        match: [latitudeRegex, "invalid latitude"]
    },
    state: {
        type: String,
        enum: statesEnum,
        required: true
    },
    city: {                                  //todo:validate city
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    number: {
        type: Number
    },
    postCode: {
        type: String,
        match: [postcodeRegex, "invalid post code"],
        required: true
    },
    public: {
        type: Boolean,
        default: true
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
            // delete ret._id;
            // delete ret.__v;
        }
    },
    timestamps: true
});

addressSchema.index({ postCode: 1, phoneNumber: 1 }, { unique: true });

const Address = model<IAddress, AddressModel>('Address', addressSchema);

export { Address };