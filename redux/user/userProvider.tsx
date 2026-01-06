import { ReactNode } from "react";
import { Provider } from "react-redux";
import { userStore } from "./userStore";

interface UserProviderProps {
    children: ReactNode;
}

const UserProvider = ({ children }: UserProviderProps) => {
    return (
        <Provider store={userStore}>{children}</Provider>
    );
}

export default UserProvider;