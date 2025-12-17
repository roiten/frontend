import styles from "./Infobar.module.css";
import { useAppSelector } from "../../../store/store.ts";

export default function Infobar() {
    const { author, createdAt, editedAt } = useAppSelector(
        (state) => state.editor.present.meta
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