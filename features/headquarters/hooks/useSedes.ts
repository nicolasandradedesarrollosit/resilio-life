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

  useEffect(() => {
    if (error) {
      dispatch(clearHeadquartersData());
    }
  }, [error, dispatch]);
}
