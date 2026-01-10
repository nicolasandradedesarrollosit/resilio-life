import { useDispatch, useSelector } from "react-redux";
import { openModal, closeModal, toggleModal } from "@/redux/modalSlice";
import type { RootState, AppDispatch } from "@/redux/store";
import { selectModalOpen } from "@/redux/modalSlice";

export const useModal = (modalId: string) => {
    const dispatch = useDispatch<AppDispatch>();
    const allModals = useSelector(selectModalOpen);
    const isOpen = !!allModals[modalId];

    const onOpen = () => {
        dispatch(openModal(modalId));
    };
    
    const onClose = () => {
        dispatch(closeModal(modalId));
    };
    
    const onToggle = () => {
        dispatch(toggleModal(modalId));
    };

    const onOpenChange = () => {
        dispatch(toggleModal(modalId));
    };

    return { 
        isOpen, 
        onOpen, 
        onClose, 
        onToggle,
        onOpenChange 
    };
}