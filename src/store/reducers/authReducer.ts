import { createSlice } from "@reduxjs/toolkit";

type AuthState = {
    isAuth: boolean;
};

const initialState: AuthState = {
    isAuth: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess(state) {
            state.isAuth = true;
        },
        logout(state) {
            state.isAuth = false;
        },
    },
});

export type { AuthState };
export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
