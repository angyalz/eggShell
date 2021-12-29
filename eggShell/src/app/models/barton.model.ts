export interface Barton {

    _id: string;
    bartonName: string,
    users: [
        {
            user: string,
            role: 'owner' | 'user'
        }
    ],
    poultry: [
        {
            _id: string;
            species: string,
            sex: 'hen' | 'cock';
            nameOfSex: string;
            image: string;
            quantity: number,
            customName?: string,
            purchaseDate?: Date,
            purchasePrice?: number,
            ageAtPurchase?: number
        },
    ],
    feed?: [
        {
            type: string,       // _id
            unit: 'kg' | 'q',
            price: number,
            dateFrom: Date,
            dateTo?: Date,
        }
    ],
    medicine?: [
        {
            type: string,       // _id
            price?: { type: Number },
            dateFrom?: Date,
            dateTo?: Date,
        }
    ]
}
// export interface PoultryOfBarton extends Poultry {
//     _id: string;
//     species: string;
//     customName?: string;
//     sex: 'hen' | 'cock';
//     nameOfSex: string;
//     image: string;
//     quantity: number;
//     purchaseDate?: Date;
//     purchasePrice?: number;
//     ageAtPurchase?: number;
// }