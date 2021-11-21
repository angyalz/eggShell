import { Schema, model } from 'mongoose';
import idValidator from 'mongoose-id-validator';

const VaccineSchema = Schema({

    name: { type: String, required: true, unique: true},


}, {

    timestamps: true

})

VaccineSchema.plugin(idValidator);

export default model('Vaccine', VaccineSchema, 'vaccine');