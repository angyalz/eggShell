import { Schema, model } from 'mongoose';

const TokenModel = Schema({

    token: { type: String }
    
}, {
    timestamps: true
});

export default model('Token', TokenModel);