import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { getCurrentUser } from "../store/appWrite/api";

type SessionState = "load" | "authorized" | "unauthorized";

export function useRedirect() {
    const navigate = useNavigate();
    const location = useLocation();
    const [sessionState, setSessionState] = useState<SessionState>("load");

    useEffect(() => {
        setSessionState("load");

        getCurrentUser()
            .then((user) => {
                setSessionState(user ? "authorized" : "unauthorized");
            })
            .catch(() => {
                setSessionState("unauthorized");
            });
    }, [location.pathname]);

    useEffect(() => {
        const path = location.pathname;

        if (sessionState === "unauthorized") {
            navigate("/login", { replace: true });
        }

        if (
            sessionState === "authorized" &&
            (path.startsWith("/login") || path.startsWith("/register"))
        ) {
            navigate("/editor", { replace: true });
        }
    }, [sessionState, location]);

    return sessionState;
}
