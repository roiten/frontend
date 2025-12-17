import { useState } from "react";
import * as appWrite from "../../store/appWrite/api";
import styles from "./Auth.module.css";
import joinStyles from "../../../utils/joinStyle";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/reducers/authReducer";

export default function login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

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
                <>
                    <h2 className={styles.title}>Войти</h2>

                    <div className={styles.loginHelp}>
                        <span>Не зарегистрированы?</span>
                        <a href="#" onClick={(e) => {}}>
                            Войти
                        </a>
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
                </>
                {error != "" && <a className={styles.redError}>{error}</a>}

                <button className={styles.button} onClick={handleLogin}>
                    Войти
                </button>
            </div>
        </div>
    );
}
