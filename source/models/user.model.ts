import { Model, model, Schema } from 'mongoose';
import { userStatusEnum } from '../enum/userStatus.enum.js';
import validator from 'validator';
import { merchantTypeEnum } from '../enum/merchantType.enum.js';
import crypto from "crypto";

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
    apiKey: string,
    bankNumber?: string,
    nationalCode?: string,
    type: merchantTypeEnum,
    //*juridical person data
    companyCode?: number,
    nationalId?: number,
    economicCode?: number,
    //*end
    email?: string,
    password?: string,
    refreshToken?: string,
    notifPhone?: string,
    status: userStatusEnum,
    message?: string,
    createdAt: Date,
    updatedAt: Date
}

export interface IUserMethods { }

type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>({
    fullName: {
        type: String,
    },
    apiKey: {
        type: String,
        default: crypto.randomUUID()
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
    type: {
        type: String,
        enum: merchantTypeEnum
    },
    companyCode: {                              //todo:add validation
        type: Number
    },
    nationalId: {                               //todo:add validation
        type: Number
    },
    economicCode: {                             //todo:add validation
        type: Number
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
    status: {
        type: String,
        enum: userStatusEnum,
        default: userStatusEnum.UNVERIFIED
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
            delete ret.refreshToken;
            delete ret.password
            // delete ret.__v;
        }
    },
    timestamps: true
});

userSchema.index({ phoneNumber: 1 }, { unique: true });

const User = model<IUser, UserModel>('User', userSchema);

export { User };