export interface UserLoggedIn {
    _id: string;
    username: string;
    role: string;
    bartons: string[];
    accessToken: string;
    refreshToken: string;
    avatarUrl?: string;
}
