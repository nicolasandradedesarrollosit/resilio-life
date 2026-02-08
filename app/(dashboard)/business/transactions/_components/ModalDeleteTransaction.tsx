"use client";

import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Trash } from "lucide-react";
import { useDispatch } from "react-redux";

import { useApi, useModal, useIsMobile } from "@/shared/hooks";
import { removeTransaction } from "@/features/transactions/transactionsSlice";

export default function ModalDeleteTransaction({ id }: { id: string }) {
  const { isOpen, onOpenChange } = useModal("deleteTransactionModal");
  const dispatch = useDispatch();
  const isMobile = useIsMobile();
  const [shouldDelete, setShouldDelete] = useState(false);
  const [hasDeleted, setHasDeleted] = useState(false);

  const { loading: isLoading } = useApi({
    endpoint: `/transactions/${id}`,
    method: "DELETE",
    enabled: shouldDelete,
    includeCredentials: true,
  });

  useEffect(() => {
    setShouldDelete(false);
    setHasDeleted(false);
  }, [id]);

  useEffect(() => {
    if (shouldDelete && !isLoading && !hasDeleted) {
      setHasDeleted(true);
      dispatch(removeTransaction(id));
    }
  }, [shouldDelete, isLoading, hasDeleted, id, dispatch]);

  return (
    <Modal
      backdrop="blur"
      classNames={{
        body: "py-6 sm:py-8 px-6 sm:px-8 flex flex-col items-center justify-start",
        base: "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white max-h-[95vh] rounded-lg shadow-2xl border border-slate-700/50",
        header: "text-center pt-6 sm:pt-8 pb-3 sm:pb-4 px-6 sm:px-8 border-b border-slate-700/30",
        footer: "border-t border-slate-700/30 py-4 sm:py-5 px-6 sm:px-8 bg-slate-900/50",
        closeButton: "hover:bg-white/10 active:bg-white/20 top-2 right-2 sm:top-3 sm:right-3",
      }}
      isOpen={isOpen as any}
      radius="lg"
      scrollBehavior="inside"
      size={isMobile ? "3xl" : "xl"}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-3 items-center">
              <h1 className="tracking-wide text-white text-lg sm:text-xl font-semibold">
                Eliminar Transacción
              </h1>
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col items-center gap-6 py-6">
                <div className="relative flex h-24 w-24 items-center justify-center mb-6 bg-magenta-fuchsia-700/20 rounded-full">
                  <Trash className="w-8 h-8 text-red-400" />
                  <div className="absolute inset-0 rounded-full border-2 border-magenta-fuchsia-500/30 scale-125" />
                </div>
                <p className="text-slate-300 text-sm sm:text-base text-center px-4 max-w-sm leading-relaxed">
                  ¿Estás seguro que deseas eliminar esta transacción? Esta acción no puede deshacerse.
                </p>
              </div>
            </ModalBody>
            <ModalFooter>
              <div className="flex flex-col sm:flex-row justify-end gap-3 w-full">
                <Button
                  className="w-full sm:w-auto border-slate-600 text-slate-200 hover:border-slate-500 hover:bg-slate-700/50 transition-all duration-200 text-sm sm:text-base font-medium"
                  size={isMobile ? "md" : "lg"}
                  variant="bordered"
                  onPress={onClose}
                >
                  Cancelar
                </Button>
                <Button
                  className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white text-sm sm:text-base font-semibold shadow-lg transition-all duration-200"
                  isLoading={isLoading}
                  size={isMobile ? "md" : "lg"}
                  onPress={async () => {
                    onClose();
                    setShouldDelete(true);
                  }}
                >
                  Eliminar transacción
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
