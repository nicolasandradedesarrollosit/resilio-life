import { configureStore } from "@reduxjs/toolkit";

import userReducer from "@/features/auth/authSlice";
import AllUserReducer from "@/features/allUsers/allUserSlice";
import ModalReducer from "@/features/modal/modalSlice";
import NavbarReducer from "@/features/navbar/navbarSlice";
import EventsReducer from "@/features/events/eventsSlice";
import MessagesReducer from "@/features/messages/messageSlice";
import HeadquartersReducer from "@/features/headquarters/headquartersSlice";
import BenefitsReducer from "@/features/benefits/benefitsSlice";
import TransactionsReducer from "@/features/transactions/transactionsSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    allUser: AllUserReducer,
    modal: ModalReducer,
    navbar: NavbarReducer,
    events: EventsReducer,
    messages: MessagesReducer,
    headquarters: HeadquartersReducer,
    benefits: BenefitsReducer,
    transactions: TransactionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
