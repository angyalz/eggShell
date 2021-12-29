import { Poultry } from "./poultry.model";

export interface PoultryOfBarton extends Poultry{
    // _id: string;
    // species: string;
    // sex: 'hen' | 'cock';
    // nameOfSex: string;
    // image: string;
    // quantity: number;
    customName?: string;
    purchaseDate?: Date;
    purchasePrice?: number;
    ageAtPurchase?: number;
}