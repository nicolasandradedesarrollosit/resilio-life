/**
 * Create transaction form business logic hook
 * Handles transaction creation with validation and API calls
 */

import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { transactionsService } from "@/features/transactions/services/transactionsService";
import { addTransaction } from "@/features/transactions/transactionsSlice";
import { selectAllBenefits } from "@/features/benefits/benefitsSlice";
import type { BenefitData } from "@/shared/types";
import { REQUIRED_FIELD_ERROR_MESSAGE } from "@/shared/utils/validation";

interface TransactionValidations {
  userId: string | null;
  benefitId: string | null;
}

// MongoDB ObjectId validation regex
const OBJECTID_REGEX = /^[a-fA-F0-9]{24}$/;

export interface UseCreateTransactionReturn {
  validations: TransactionValidations;
  isLoading: boolean;
  selectedBenefitId: string | null;
  activeBenefits: BenefitData[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBenefitSelect: (benefitId: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  resetForm: () => void;
}

/**
 * Custom hook for transaction creation form
 */
export function useCreateTransaction(
  isOpen: boolean,
  onSuccess?: () => void
): UseCreateTransactionReturn {
  const dispatch = useDispatch();
  const benefits = (useSelector(selectAllBenefits) as BenefitData[]) || [];
  const activeBenefits = benefits.filter((b) => b.isActive);

  const [isLoading, setIsLoading] = useState(false);
  const [selectedBenefitId, setSelectedBenefitId] = useState<string | null>(
    null
  );

  const [validations, setValidations] = useState<TransactionValidations>({
    userId: null,
    benefitId: null,
  });

  /**
   * Reset form when modal opens
   */
  useEffect(() => {
    if (isOpen) {
      setSelectedBenefitId(null);
      setValidations({ userId: null, benefitId: null });
    }
  }, [isOpen]);

  /**
   * Handle user ID change
   */
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      if (!value || value.trim() === "") {
        setValidations((prev) => ({
          ...prev,
          [name]: REQUIRED_FIELD_ERROR_MESSAGE,
        }));
        return;
      }

      if (name === "userId") {
        const isValid = OBJECTID_REGEX.test(value);
        setValidations((prev) => ({
          ...prev,
          userId: isValid
            ? null
            : "Debe ser un ID válido (24 caracteres hexadecimales)",
        }));
      }
    },
    []
  );

  /**
   * Handle benefit selection
   */
  const handleBenefitSelect = useCallback((benefitId: string) => {
    setSelectedBenefitId(benefitId);
    setValidations((prev) => ({ ...prev, benefitId: null }));
  }, []);

  /**
   * Reset form
   */
  const resetForm = useCallback(() => {
    setValidations({ userId: null, benefitId: null });
    setSelectedBenefitId(null);
  }, []);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const hasErrors = Object.values(validations).some(
        (error) => error !== null
      );

      if (hasErrors) return;

      if (!selectedBenefitId) {
        setValidations((prev) => ({
          ...prev,
          benefitId: "Debe seleccionar un beneficio",
        }));
        return;
      }

      const formDataObj = new FormData(e.currentTarget);
      const data = {
        userId: formDataObj.get("userId") as string,
        benefitId: selectedBenefitId,
      };

      try {
        setIsLoading(true);

        const response = await transactionsService.create(data);

        if (response.data) {
          dispatch(addTransaction(response.data));
          resetForm();
          if (onSuccess) {
            onSuccess();
          }
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Error desconocido";
      } finally {
        setIsLoading(false);
      }
    },
    [validations, selectedBenefitId, dispatch, resetForm, onSuccess]
  );

  return {
    validations,
    isLoading,
    selectedBenefitId,
    activeBenefits,
    handleChange,
    handleBenefitSelect,
    handleSubmit,
    resetForm,
  };
}
