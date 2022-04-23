import { FeedOfBartonToSave } from "./feed-of-barton-to-save.model";
import { MedicineOfBartonToSave } from "./medicine-of-barton-to-save.model";
import { PoultryOfBartonToSave } from "./poultry-of-barton-to-save.model";

export interface BartonToSave {

    _id?: string;
    active: boolean,
    bartonName: string,
    users: [
        {
            user: string,
            role: 'owner' | 'user'
        }
    ],
    poultry: PoultryOfBartonToSave[],
    feed?: FeedOfBartonToSave[],
    medicine?: MedicineOfBartonToSave[]
}

