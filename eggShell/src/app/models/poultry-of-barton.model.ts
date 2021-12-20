import { Poultry } from "./poultry.model";

export interface PoultryOfBarton extends Poultry{
    // _poultryId: string;
    // species: string;
    customName?: string;
    // sex: 'hen' | 'cock';
    // nameOfSex: string;
    // quantity:
    purchaseDate?: Date;
    purchasePrice?: number;
    ageAtPurchase?: number;
    // image: string;
}