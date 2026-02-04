import type { AppDispatch, RootState } from "@/shared/store";

import { useDispatch, useSelector } from "react-redux";
import { useMemo } from "react";

import { openModal, closeModal, toggleModal } from "@/features/modal/modalSlice";

export const useModal = (modalId: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const isOpen = useSelector(
    useMemo(
      () => (state: RootState) => !!state.modal.open[modalId],
      [modalId],
    ),
  );

  const onOpen = () => {
    dispatch(openModal(modalId));
  };

  const onClose = () => {
    dispatch(closeModal(modalId));
  };

  const onOpenChange = () => {
    dispatch(toggleModal(modalId));
  };

  return {
    isOpen,
    onOpen,
    onClose,
    onOpenChange,
  };
};
