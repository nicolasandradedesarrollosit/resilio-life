import { useDispatch, useSelector } from "react-redux";
import { setUserData, clearUserData, setLoading } from "@/redux/user/userSlice";
import { selectUserData } from "@/redux/user/userSlice"; 
import { useEffect, useState } from "react";
import { checkSession } from "@/services/userService";
import type { UserData } from "@/types/userData";

let isVerifyingSession = false;
let hasSessionBeenChecked = false;

export const useUserData = () => {
    const dispatch = useDispatch();
    const userDataState = useSelector(selectUserData);
    const [hasCheckedSession, setHasCheckedSession] = useState(hasSessionBeenChecked);

    useEffect(() => {
        if (hasSessionBeenChecked) {
            return;
        }

        if (isVerifyingSession) {
            return;
        }

        const verifySession = async () => {
            isVerifyingSession = true;
            
            try {
                dispatch(setLoading(true));
                const result = await checkSession();
                
                if (result?.loggedIn && result.user) {
                    const userData = result.user as UserData;
                    dispatch(setUserData({
                        data: userData,
                        loading: false,
                        loaded: true,
                    }));
                } else {
                    dispatch(setUserData({
                        data: null,
                        loading: false,
                        loaded: true,
                    }));
                }
            } catch (error) {
                dispatch(setUserData({
                    data: null,
                    loading: false,
                    loaded: true,
                }));
            } finally {
                isVerifyingSession = false;
                hasSessionBeenChecked = true;
                setHasCheckedSession(true);
            }
        };
        
        verifySession();
    }, [dispatch]);

    const handleLogout = () => {
        dispatch(clearUserData());
    }
    
    return { 
        userDataState,
        userData: userDataState.data,
        logOut: handleLogout, 
        hasCheckedSession,
        setUserDataState: (userData: UserData | null) => dispatch(setUserData({ data: userData, loading: false, loaded: true })), 
        setLoadingState: (loading: boolean) => dispatch(setLoading(loading)) 
    };
}