import { Schema, model } from 'mongoose';
import idValidator from 'mongoose-id-validator';

const UserSchema = Schema({

    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, match: /.+\@.+\..+/, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    barton: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Barton'
        }
    ]

}, {

    timestamps: true

})

UserSchema.plugin(idValidator);

export default model('User', UserSchema, 'users');