import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import AllUserReducer from "./allUserSlice";
import ModalReducer from "./modalSlice";
import NavbarReducer from "./navbarSlice";

export const store = configureStore({
    reducer: {
        user: userReducer,
        allUser: AllUserReducer,
        modal: ModalReducer,
        navbar: NavbarReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;