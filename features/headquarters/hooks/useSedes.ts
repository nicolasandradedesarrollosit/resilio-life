import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { headquartersService } from "@/features/headquarters/services/headquartersService";
import {
  selectHeadquartersData,
  setHeadquartersData,
  clearHeadquartersData,
  setLoading,
} from "@/features/headquarters/headquartersSlice";

export function useSedes() {
  const dispatch = useDispatch();
  const headquartersState = useSelector(selectHeadquartersData);

  useEffect(() => {
    if (headquartersState.loaded) return;

    const fetchHeadquarters = async () => {
      try {
        dispatch(setLoading(true));

        const response = await headquartersService.getAll();

        if (response.data && Array.isArray(response.data)) {
          dispatch(
            setHeadquartersData({ items: response.data, loading: false, loaded: true })
          );
        }
      } catch {
        dispatch(clearHeadquartersData());
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchHeadquarters();
  }, [headquartersState.loaded, dispatch]);
}
