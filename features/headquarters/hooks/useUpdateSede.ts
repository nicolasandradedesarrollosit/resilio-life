/**
 * Update sede (headquarters) form business logic hook
 * Handles sede updates with validation and API calls
 */

import type { HeadquartersData } from "@/shared/types";

import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { headquartersService } from "@/features/headquarters/services/headquartersService";
import {
  updateHeadquarters,
  selectAllHeadquarters,
} from "@/features/headquarters/headquartersSlice";
import {
  SHORT_TEXT_REGEX,
  SHORT_TEXT_ERROR_MESSAGE,
  REQUIRED_FIELD_ERROR_MESSAGE,
} from "@/shared/utils/validation";

interface SedeValidations {
  name: string | null;
  latitude: string | null;
  longitude: string | null;
}

export interface UseUpdateSedeReturn {
  sedeToUpdate: HeadquartersData | undefined;
  validations: SedeValidations;
  isLoading: boolean;
  latitude: string;
  longitude: string;
  setLatitude: (value: string) => void;
  setLongitude: (value: string) => void;
  handleNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCoordChange: (field: "latitude" | "longitude", value: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  resetForm: () => void;
}

/**
 * Custom hook for sede update form
 */
export function useUpdateSede(
  sedeId: string,
  isOpen: boolean,
  onSuccess?: () => void,
): UseUpdateSedeReturn {
  const dispatch = useDispatch();
  const items = useSelector(selectAllHeadquarters);
  const sedeToUpdate = items.find((h: HeadquartersData) => h._id === sedeId);

  const [isLoading, setIsLoading] = useState(false);
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");

  const [validations, setValidations] = useState<SedeValidations>({
    name: null,
    latitude: null,
    longitude: null,
  });

  /**
   * Load existing sede data when modal opens
   */
  useEffect(() => {
    if (isOpen && sedeToUpdate) {
      setLatitude(String(sedeToUpdate.coordinates?.[0] ?? ""));
      setLongitude(String(sedeToUpdate.coordinates?.[1] ?? ""));
      setValidations({ name: null, latitude: null, longitude: null });
    }
  }, [isOpen, sedeToUpdate]);

  /**
   * Handle name change
   */
  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;

      if (!value || value.trim() === "") {
        setValidations((prev) => ({
          ...prev,
          name: REQUIRED_FIELD_ERROR_MESSAGE,
        }));

        return;
      }

      const isValid = SHORT_TEXT_REGEX.test(value);

      setValidations((prev) => ({
        ...prev,
        name: isValid ? null : SHORT_TEXT_ERROR_MESSAGE,
      }));
    },
    [],
  );

  /**
   * Handle coordinate change
   */
  const handleCoordChange = useCallback(
    (field: "latitude" | "longitude", value: string) => {
      if (field === "latitude") setLatitude(value);
      else setLongitude(value);

      if (!value || value.trim() === "") {
        setValidations((prev) => ({
          ...prev,
          [field]: REQUIRED_FIELD_ERROR_MESSAGE,
        }));

        return;
      }

      const num = parseFloat(value);

      if (isNaN(num)) {
        setValidations((prev) => ({
          ...prev,
          [field]: "Debe ser un número válido",
        }));

        return;
      }

      if (field === "latitude" && (num < -90 || num > 90)) {
        setValidations((prev) => ({ ...prev, [field]: "Entre -90 y 90" }));

        return;
      }

      if (field === "longitude" && (num < -180 || num > 180)) {
        setValidations((prev) => ({ ...prev, [field]: "Entre -180 y 180" }));

        return;
      }

      setValidations((prev) => ({ ...prev, [field]: null }));
    },
    [],
  );

  /**
   * Reset form
   */
  const resetForm = useCallback(() => {
    setValidations({ name: null, latitude: null, longitude: null });
  }, []);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);

      const nextValidations: SedeValidations = {
        ...validations,
        latitude:
          !latitude || Number.isNaN(lat)
            ? "Debe ser un número válido"
            : validations.latitude,
        longitude:
          !longitude || Number.isNaN(lng)
            ? "Debe ser un número válido"
            : validations.longitude,
      };

      setValidations(nextValidations);

      const hasErrors = Object.values(nextValidations).some(
        (error) => error !== null,
      );

      if (hasErrors) return;

      const formDataObj = new FormData(e.currentTarget);
      const data = {
        name: formDataObj.get("name") as string,
        coordinates: [lat, lng] as [number, number],
      };

      try {
        setIsLoading(true);

        const response = await headquartersService.update(sedeId, data);

        if (response.data) {
          dispatch(updateHeadquarters(response.data));
          if (onSuccess) {
            onSuccess();
          }
        }
      } catch {
        // Error handled silently
      } finally {
        setIsLoading(false);
      }
    },
    [validations, latitude, longitude, sedeId, dispatch, onSuccess],
  );

  return {
    sedeToUpdate,
    validations,
    isLoading,
    latitude,
    longitude,
    setLatitude,
    setLongitude,
    handleNameChange,
    handleCoordChange,
    handleSubmit,
    resetForm,
  };
}
