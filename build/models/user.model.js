import { model, Schema } from 'mongoose';
import validator from 'validator';
const userSchema = new Schema({
    fullName: {
        type: String,
    },
    email: {
        type: String,
        validate: [validator.isEmail, 'not valid email address']
    },
    phoneNumber: {
        type: String,
        required: true,
        maxlength: 11,
        minlength: 11,
        validate: [validator.isMobilePhone, 'not valid phone number']
    },
    password: {
        type: String
    },
    refreshToken: {
        type: String,
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
userSchema.index({ phoneNumber: 1 }, { unique: true });
const User = model('User', userSchema);
export { User };
