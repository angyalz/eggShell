import { Poultry } from "./poultry.model";

export class PoultryOfBarton extends Poultry{
    // _poultryId: string;
    // species: string;
    customName?: string;
    // sex: 'hen' | 'cock';
    // nameOfSex: string;
    quantity: number = 1;
    purchaseDate?: Date;
    purchasePrice?: number;
    ageAtPurchase?: number;
    // image: string;
}