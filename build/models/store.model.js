import mongoose, { model, Schema } from 'mongoose';
import validator from 'validator';
const storeSchema = new Schema({
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
            validator: (value) => {
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
storeSchema.index({ name: 1 }, { unique: true });
storeSchema.index({ merchantId: 1 }, { unique: true });
const Store = model('Store', storeSchema);
export { Store };
