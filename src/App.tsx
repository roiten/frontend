import { useState, useEffect } from "react";
import "./App.css";
import PresentationComponent from "./view/Editor/Presentation";
import Auth from "./view/Auth/Auth.tsx";
import { Client, Account } from "appwrite";

const client = new Client()
    .setEndpoint("https://syd.cloud.appwrite.io/v1")
    .setProject("691eb9d4000abbc15a03");

const account = new Account(client);

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isDemoMode, setIsDemoMode] = useState(false);

    useEffect(() => {
        checkAuth();
    }, []);

    useEffect(() => {
        if (isAuthenticated || isDemoMode) {
            document.body.classList.add('editor-mode');
            document.body.classList.remove('auth-mode');
        } else {
            document.body.classList.add('auth-mode');
            document.body.classList.remove('editor-mode');
        }
    }, [isAuthenticated, isDemoMode]);

    const checkAuth = async () => {
        try {
            await account.get();
            setIsAuthenticated(true);
        } catch (error) {
            setIsAuthenticated(false);
        }
    };

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
        setIsDemoMode(false);
    };

    const handleLogout = async () => {
        try {
            await account.deleteSession("current");
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setIsAuthenticated(false);
            setIsDemoMode(false);
        }
    };

    const handleDemoMode = () => {
        setIsAuthenticated(false);
        setIsDemoMode(true);
    };

    if (!isAuthenticated && !isDemoMode) {
        return <Auth onLoginSuccess={handleLoginSuccess} onDemoMode={handleDemoMode} />;
    }

    return <PresentationComponent onLogout={handleLogout} />;
}

export default App;