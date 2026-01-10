"use client"
import { getUsers } from "@/services/userService";
import { useSelector } from "react-redux";
import { selectAllUsers } from "@/redux/allUserSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setAllUserData, setLoading } from "@/redux/allUserSlice";  


export const useUsers = () => {
    const AllUsers = useSelector(selectAllUsers);
    const dispatch = useDispatch();

    useEffect(() => {
        if (AllUsers.length === 0) {
            dispatch(setLoading(true));
            const fetchUsers = async () => {
                try {
                    const users = await getUsers();
                    dispatch(setAllUserData({ users, loaded: true, loading: false }));
                } catch (error) {
                    console.error("Error fetching users:", error);
                    dispatch(setAllUserData({ users: [], loaded: true, loading: false }));
                }
            };
            fetchUsers();
        }
    }, [dispatch]);

    return AllUsers;
}