import { model, Schema } from 'mongoose';
import { statesEnum } from '../enum/states.enum.js';
const latitudeRegex = /^-?([1-8]?[0-9](\.[0-9]+)?|90(\.0+)?)$/;
const longitudeRegex = /^-?((1?[0-7]?|[1-9]?[0-9])(\.[0-9]+)?|180(\.0+)?)$/;
const postcodeRegex = /^\d{10}$/;
const phoneRegex = /^09[0-9]{9}$/;
const addressSchema = new Schema({
    phoneNumber: {
        type: String,
        match: [phoneRegex, "invalid phone number"],
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
    city: {
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
            // delete ret._id;
            // delete ret.__v;
        }
    },
});
const Address = model('Address', addressSchema);
export { Address };
