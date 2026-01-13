import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserData } from "@/types/userData.type";

interface AllUserDataState {
    users: Array<UserData>;
    loading: boolean;
    loaded: boolean;
}

const initialState: AllUserDataState = {
    users: [],
    loading: false,
    loaded: false,
};

const allUserSlice = createSlice({
    name: "allUsers",
    initialState,
    reducers: {
        setAllUserData(state, action: PayloadAction<{ users: Array<UserData>; loading?: boolean; loaded?: boolean }>) {
            state.users = action.payload.users;
            if (action.payload.loading !== undefined) state.loading = action.payload.loading;
            if (action.payload.loaded !== undefined) state.loaded = action.payload.loaded;
        },
        clearAllUserData(state) {
            state.users = [];
            state.loaded = false;
            state.loading = false;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
    },
});

export const { setAllUserData, clearAllUserData, setLoading } = allUserSlice.actions;
export default allUserSlice.reducer;

export const selectAllUserData = (state: { allUser: AllUserDataState }) => state.allUser;
export const selectAllUsers = (state: { allUser: AllUserDataState }) => state.allUser.users;