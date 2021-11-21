import { Schema, model } from 'mongoose';
import idValidator from 'mongoose-id-validator';

const FeedSchema = Schema({

    name: { type: String, required: true, unique: true },
    // weight: { type: Number, required: true },
    // unit: { type: String, enum: ['kg', 'q'], default: 'kg', required: true }


}, {

    timestamps: true

})

FeedSchema.plugin(idValidator);

export default model('Feed', FeedSchema, 'feed');