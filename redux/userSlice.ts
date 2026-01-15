import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserData, UserDataState } from '@/types/userData.type';

const initialState: UserDataState = {
    data: null,
    loading: false,
    loaded: true,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserData(state, action: PayloadAction<{ data: UserData | null; loading?: boolean; loaded?: boolean }>) {
            state.data = action.payload.data;
            if (action.payload.loading !== undefined) state.loading = action.payload.loading;
            if (action.payload.loaded !== undefined) state.loaded = action.payload.loaded;
        },
        clearUserData() {
            return initialState;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
    },
});

export const { setUserData, clearUserData, setLoading } = userSlice.actions;
export default userSlice.reducer;

export const selectUserData = (state: { user: UserDataState }) => state.user;
export const selectUserDataOnly = (state: { user: UserDataState }) => state.user.data;
export const selectUserLoading = (state: { user: UserDataState }) => state.user.loading;
export const selectUserLoaded = (state: { user: UserDataState }) => state.user.loaded;