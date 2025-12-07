import styles from "./Infobar.module.css";
import { useSelector } from "react-redux";
import type { Editor } from "../../../store/types.ts";

export default function Infobar() {
    const { author, createdAt, editedAt } = useSelector(
        (state: Editor) => state.present.meta
    );

    const safeCreatedAt = new Date(createdAt);
    const safeEditedAt = new Date(editedAt);

    return (
        <div className={styles.infobar}>
            <span>Автор: {author || "неизвестен"}</span>
            <span>Создано: {safeCreatedAt.toLocaleString()}</span>
            <span>Изменено: {safeEditedAt.toLocaleString()}</span>
        </div>
    );
}