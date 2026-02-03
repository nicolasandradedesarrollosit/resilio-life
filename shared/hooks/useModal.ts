import type { AppDispatch } from "@/shared/store";

import { useDispatch, useSelector } from "react-redux";

import { openModal, closeModal, toggleModal } from "@/features/modal/modalSlice";
import { selectModalOpen } from "@/features/modal/modalSlice";

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
    onOpenChange,
  };
};
