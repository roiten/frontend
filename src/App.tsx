import { useState, useEffect } from "react";
import "./App.css";
import PresentationComponent from "./view/Editor/Presentation";
import Auth from "./view/Auth/Auth.tsx";
import * as appWrite from "./store/appWrite/api.ts";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isDemoMode, setIsDemoMode] = useState(false);

    useEffect(() => {
        checkAuth();
    }, []);

    useEffect(() => {
        if (isAuthenticated || isDemoMode) {
            document.body.classList.add("editorMode");
            document.body.classList.remove("authMode");
        } else {
            document.body.classList.add("authMode");
            document.body.classList.remove("editorMode");
        }
    }, [isAuthenticated, isDemoMode]);

    const checkAuth = async () => {
        const user = appWrite.getCurrentUser();
        if (user != null) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    };

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
        setIsDemoMode(false);
    };

    const handleLogout = async () => {
        appWrite.deleteSession();
        setIsAuthenticated(false);
        setIsDemoMode(false);
    };

    const handleDemoMode = () => {
        setIsAuthenticated(false);
        setIsDemoMode(true);
    };

    if (!isAuthenticated && !isDemoMode) {
        return (
            <Auth
                onLoginSuccess={handleLoginSuccess}
                onDemoMode={handleDemoMode}
            />
        );
    }

    return <PresentationComponent onLogout={handleLogout} />;
}

export default App;
