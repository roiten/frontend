import { useState } from "react";
import * as appWrite from "../../store/appWrite/api";
import styles from "./Auth.module.css";
import joinStyles from "../../../utils/joinStyle";

type AuthProps = {
    onLoginSuccess: () => void;
    onDemoMode: () => void;
};

export default function Auth() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [mode, setMode] = useState<"login" | "register" | "registerProfile">(
        "login",
    );
    const [error, setError] = useState("");

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
            // onLoginSuccess();
        } catch (err) {
            setError("Ошибка входа, попробуйте позже");
        }
    }

    return (
    <div className={styles.app}>
        <div className={styles.loginForm}>
            {mode !== "registerProfile" && (
                <>
                    <h2 className={styles.title}>
                        {mode === "login" ? "Войти" : "Регистрация"}
                    </h2>

                    <div className={styles.loginHelp}>
                        <span>
                            {mode === "login"
                                ? "Не зарегистрированы?  "
                                : "Уже есть аккаунт?  "}
                        </span>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                setMode(
                                    mode === "login" ? "register" : "login",
                                );
                            }}
                        >
                            {mode === "login" ? "Создать аккаунт" : "Войти"}
                        </a>
                    </div>

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
                </>
            )}

            {mode === "registerProfile" && (
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

                    <button className={styles.button} onClick={handleRegister}>
                        Завершить регистрацию
                    </button>
                </>
            )}

            {error != "" && <a className={styles.redError}>{error}</a>}

            {mode === "login" ? (
                <button className={styles.button} onClick={handleLogin}>
                    Войти
                </button>
            ) : mode === "register" ? (
                <button
                    className={styles.button}
                    onClick={
                        email && password
                            ? () => setMode("registerProfile")
                            : undefined
                    }
                >
                    Далее
                </button>
            ) : null}

            {mode !== "login" && (
                <div className={styles.demoHelp}>
                    <span>{"Сейчас не нужен аккаунт?  "}</span>
                    <a href="#">
                        {"Ограниченная версия"}
                    </a>
                </div>
            )}
        </div>
    </div>
    );
}
