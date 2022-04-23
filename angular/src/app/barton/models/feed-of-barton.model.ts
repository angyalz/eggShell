export interface FeedOfBarton {
    _id: string;
    type: string,       // _id
    unit: 'kg' | 'q',
    price: number,
    dateFrom: Date,
    dateTo?: Date,
}
