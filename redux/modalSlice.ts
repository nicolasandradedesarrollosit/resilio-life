import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ModalState {
    open: Record<string, boolean>;
}

const initialState: ModalState = {
    open: {},
};

const modalSlice = createSlice({
    name: "modal",
    initialState,
    reducers: {
        openModal: (state, action: PayloadAction<string>) => {
            state.open[action.payload] = true;
        },
        closeModal: (state, action: PayloadAction<string>) => {
            state.open[action.payload] = false;
        },
        toggleModal: (state, action: PayloadAction<string>) => {
            state.open[action.payload] = !state.open[action.payload];
        }
    }
});

export const { openModal, closeModal, toggleModal } = modalSlice.actions;
export default modalSlice.reducer;

export const selectModalOpen = (state: { modal: ModalState }) => state.modal.open;