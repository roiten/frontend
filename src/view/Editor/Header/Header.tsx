import styles from "./Header.module.css";
import joinStyles from "../../../../utils/joinStyle.ts";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPresentationTitle } from "../../../store/reducers/presentationReducer.ts";
import type { Editor } from "../../../store/types.ts";

export default function Header() {
    const title = useSelector((state: Editor) => state.meta.title);
    const dispatch = useDispatch();

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setPresentationTitle(event.target.value));
    };

    return (
        <div className={styles.header}>
            <img
                src={"./icons/siteIcon.png"}
                alt={"логотип слайдмейкера"}
                className={joinStyles([styles.siteLogo, styles.left])}
            />

            <div className={styles.center}>
                <input
                    type="text"
                    className={styles.title}
                    value={title}
                    onChange={handleTitleChange}
                />
            </div>
            <span className={styles.status}>Сохранено</span>
        </div>
    );
}
