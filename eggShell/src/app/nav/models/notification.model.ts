// export type Notice = RequestNotice | InviteNotice

// export interface RequestNotice {
//     _id: string,
//     username: string,
//     avatarUrl?: string
// }

// export interface InviteNotice {
//     _id: string,
//     bartonName: string,
// }

export interface Notice {
    type: 'request' | 'invite',
    _id: string,
    username?: string,
    avatarUrl?: string,
    bartonName?: string,
}