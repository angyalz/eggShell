export interface MedicineOfBartonToSave {
    medicine: string,       // _id
    price?: { type: Number },
    dateFrom?: Date,
    dateTo?: Date,
}
