export interface UserData {
    id: string;
    name: string;
    lastName: string;
    email: string;
    isAdmin: boolean;
    isPremium: boolean;
    isInfluencer: boolean;
    points: number;
    email_verified: boolean;
    is_banned: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface UserDataState {
    data: UserData | null;
    loading: boolean;
    loaded: boolean;
}