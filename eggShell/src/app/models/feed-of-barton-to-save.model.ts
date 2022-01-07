export interface FeedOfBartonToSave {
    feed: string,       // _id
    unit?: 'kg' | 'q',
    price?: number,
    dateFrom?: Date,
    dateTo?: Date,
}
