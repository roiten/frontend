import { Navigate } from "react-router";
// import { useAppSelector } from "../store/store";
import type { JSX } from "react";
import { useAppDispatch } from "../store/store";
import { getCurrentUser } from "../store/appWrite/api";
import { loginSuccess, logout } from "../store/reducers/authReducer";

type Props = {
    children: JSX.Element;
};

export default function ProtectedRoute({ children }: Props) {
    // const isAuth = useAppSelector((state) => state.auth.isAuth);
    const dispatch = useAppDispatch();
    const checkAuth = async () => {
        const user = getCurrentUser();
        if (user != null) {
            dispatch(loginSuccess());
        } else {
            dispatch(logout());
        }
    };
    if (!checkAuth) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
