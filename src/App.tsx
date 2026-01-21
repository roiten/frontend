import { Navigate, Route, Routes } from "react-router";
import Login from "./view/Auth/Login";
import Registration from "./view/Auth/Register";
import Presentation from "./view/Editor/Presentation";
import Slideshow from "./view/Slideshow/Slideshow";
import NotFoundError from "./view/Error/NotFoundError";
import { useRedirect } from "./hooks/useRedirect";
import SpeakerView from "./view/Slideshow/SpeakerView";

export default function App() {
    useRedirect();

    return (
        <Routes>
            <Route path="/" element={<Navigate to="/editor" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/editor" element={<Presentation />} />
            <Route path="/show" element={<Slideshow isSpeakerMode={false} />} />
            <Route
                path="/speaker-show"
                element={<Slideshow isSpeakerMode={true} />}
            />
            <Route path="/speaker-view" element={<SpeakerView />} />
            <Route path="*" element={<NotFoundError />} />
        </Routes>
    );
}
