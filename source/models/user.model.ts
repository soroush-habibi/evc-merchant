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
    password?: string,
    refreshToken?: string
}

export interface IUserMethods { }

type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>({
    fullName: {
        type: String,
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

const User = model<IUser, UserModel>('User', userSchema);

export { User };