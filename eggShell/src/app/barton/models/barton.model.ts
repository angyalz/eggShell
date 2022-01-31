import { FeedOfBarton } from "./feed-of-barton.model";
import { MedicineOfBarton } from "./medicine-of-barton.model";
import { PoultryOfBarton } from "./poultry-of-barton.model";
import { UsersOfBarton } from "./users-of-barton.model";

export interface Barton {
    _id?: string;
    active?: boolean,
    bartonName?: string,
    users: UsersOfBarton[],
    poultry: PoultryOfBarton[],
    // poultry: [
    //     {
    //         _id: string;
    //         species: string,
    //         sex: 'hen' | 'cock';
    //         nameOfSex: string;
    //         image: string;
    //         quantity: number,
    //         customName?: string,
    //         purchaseDate?: Date,
    //         purchasePrice?: number,
    //         ageAtPurchase?: number
    //     },
    // ],
    feed?: FeedOfBarton[],
    // feed?: [
    //     {
    //         _id: string;
    //         type: string,       // _id
    //         unit: 'kg' | 'q',
    //         price: number,
    //         dateFrom: Date,
    //         dateTo?: Date,
    //     }
    // ],
    medicine?: MedicineOfBarton[]
    // medicine?: [
    //     {
    //         _id: string;
    //         type: string,       // _id
    //         price?: { type: Number },
    //         dateFrom?: Date,
    //         dateTo?: Date,
    //     }
    // ]
}