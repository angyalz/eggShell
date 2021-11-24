export interface UserLoggedIn {
    _id: string;
    username: string;
    role: string;
    accessToken: string;
    refreshToken: string;
}
