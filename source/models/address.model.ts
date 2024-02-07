import mongoose, { Model, model, Schema } from 'mongoose';
import { statesEnum } from 'source/enum/states.enum.js';
import validator from 'validator';

const latitudeRegex = /^-?([1-8]?[0-9](\.[0-9]+)?|90(\.0+)?)$/;
const longitudeRegex = /^-?((1?[0-7]?|[1-9]?[0-9])(\.[0-9]+)?|180(\.0+)?)$/;
const postcodeRegex = /^\d{10}$/;

export interface IAddress {
    owner: mongoose.Schema.Types.ObjectId,
    longitude: string,
    latitude: string,
    state: statesEnum,
    city: string,
    address: string,
    number?: number,
    postCode: string
}

export interface IAddressMethods { }

type AddressModel = Model<IAddress, {}, IAddressMethods>;

const addressSchema = new Schema<IAddress, AddressModel, IAddressMethods>({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    longitude: {
        type: String,
        required: true,
        match: [longitudeRegex, "invalid longitude"]
    },
    latitude: {
        type: String,
        required: true,
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
            delete ret.refreshToken;
            // delete ret.__v;
        }
    },
});

// searches are based on national-code and mobile-number
addressSchema.index({ phoneNumber: 1 }, { unique: true });

const Address = model<IAddress, AddressModel>('Address', addressSchema);

export { Address };