export interface Egg {
    qty: number,
    date: Date
}

export interface EggList {
    active: boolean,
    bartonId: string,
    eggs: Egg[],
    poultryId: string[]
}
