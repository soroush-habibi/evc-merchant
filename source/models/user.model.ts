import { Model, model, Schema } from 'mongoose';
import validator from 'validator';

// enum Roles {
//     user = "user",
//     admin = "admin"
// }

// enum Gender {
//     male = "male",
//     female = "female"
// }

export interface IUser {
    phoneNumber: string,
    fullName?: string,
    bankNumber?: string,
    nationalCode?: string,
    email?: string,
    password?: string,
    refreshToken?: string,
    notifPhone?: string,
    wallet?: number
}

export interface IUserMethods { }

type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>({
    fullName: {
        type: String,
    },
    bankNumber: {                                       //todo:add validation
        type: String,
        minlength: 16,
        maxlength: 16
    },
    nationalCode: {
        type: String,
        validate: {
            validator: (value: any) => {
                return /^\d{3}\d{6}\d{1}$/.test(value);
            },
            message: "invalid national code"
        }
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
    },
    notifPhone: {
        type: String,
        maxlength: 11,
        minlength: 11,
        validate: [validator.isMobilePhone, 'not valid phone number']
    },
    wallet: {
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
            delete ret.refreshToken;
            // delete ret.__v;
        }
    },
});

userSchema.index({ phoneNumber: 1 }, { unique: true });

const User = model<IUser, UserModel>('User', userSchema);

export { User };