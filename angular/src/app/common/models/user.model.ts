export interface User {
    _id: string;
    username: string;
    email: string;
    role: 'admin' | 'user';
    pendingRequests?: [
        {
            _id: string,
            username: string,
            avatarUrl?: string,
            timestamp: Date
        }
    ];
    pendingInvitations?: [
        {
            _id: string,
            bartonName: string,
            timestamp: Date
        }
    ];
    bartons?: string[];
}

export interface UserReg {
    username: string;
    email: string;
    password: string;
}

export interface UserLogin {
    email: string;
    password: string;
}

export interface UserLoggedIn {
    _id: string;
    username: string;
    email: string;
    role: 'admin' | 'user';
    bartons: string[];
    accessToken: string;
    refreshToken: string;
    avatarUrl?: string;
}
