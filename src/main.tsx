import { Provider } from "react-redux";
import { store } from "./store/store";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import Login from "./view/Auth/Login";
import Slideshow from "./view/Slideshow/Slideshow";
import Presentation from "./view/Editor/Presentation";
import Registration from "./view/Auth/Register";
import ProtectedComponent from "./view/ProtectedComponent";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement,
);
root.render(
    <Provider store={store}>
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Registration />} />

                <Route
                    path="/editor"
                    element={
                        <ProtectedComponent>
                            <Presentation />
                        </ProtectedComponent>
                    }
                />

                <Route path="/show" element={<Slideshow />} />
            </Routes>
        </BrowserRouter>
    </Provider>,
);
