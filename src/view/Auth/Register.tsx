import { useState } from "react";
import * as appWrite from "../../store/appWrite/api";
import styles from "./Auth.module.css";
import joinStyles from "../../../utils/joinStyle";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/reducers/authReducer";

export default function Registration() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [mode, setMode] = useState<"register" | "registerName">("register");
    const [error, setError] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    async function handleRegister() {
        if (!email || !password || !username) {
            setError("Заполните все поля!");
            return;
        }

        try {
            await appWrite.registerUser(email, password, username);
            handleLogin();
        } catch (err) {
            setError("Ошибка входа, попробуйте позже");
        }
    }

    async function handleLogin() {
        try {
            await appWrite.loginUser(email, password);
            dispatch(loginSuccess());
            navigate("/editor");
        } catch (err) {
            setError("Ошибка входа, попробуйте позже");
        }
    }

    return (
        <div className={styles.app}>
            <div className={styles.loginForm}>
                {mode == "register" && (
                    <>
                        <h2 className={styles.title}>Регистрация</h2>

                        <div className={styles.loginHelp}>
                            <span>Уже есть аккаунт?</span>
                            <a href="#">Создать аккаунт </a>
                        </div>
                        <form>
                            <input
                                className={joinStyles([
                                    styles.loginField,
                                    styles.fieldGap,
                                ])}
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <input
                                className={joinStyles([
                                    styles.loginField,
                                    styles.fieldSmallGap,
                                ])}
                                type="password"
                                placeholder="Пароль"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </form>
                        <button
                            className={styles.button}
                            onClick={() => setMode("registerName")}
                        >
                            Далее
                        </button>
                    </>
                )}

                {mode === "registerName" && (
                    <>
                        <input
                            className={joinStyles([
                                styles.loginField,
                                styles.fieldSmallGap,
                            ])}
                            type="text"
                            placeholder="Имя пользователя"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <button
                            className={joinStyles([
                                styles.button,
                                styles.backButton,
                            ])}
                            onClick={() => setMode("register")}
                        >
                            Назад
                        </button>

                        <button
                            className={styles.button}
                            onClick={handleRegister}
                        >
                            Завершить регистрацию
                        </button>
                    </>
                )}

                {error != "" && <a className={styles.redError}>{error}</a>}

                <div className={styles.demoHelp}>
                    <span>{"Сейчас не нужен аккаунт?  "}</span>
                    <a href="#">{"Ограниченная версия"}</a>
                </div>
            </div>
        </div>
    );
}
