import { Schema, model } from 'mongoose';
import idValidator from 'mongoose-id-validator';

const PoultrySchema = Schema({

    name: { type: String, required: true },
    sex: { type: String, enum: ['male', 'female'], required: true }

}, {

    timestamps: true

})

PoultrySchema.plugin(idValidator);

export default model('Poultry', PoultrySchema, 'poultry');