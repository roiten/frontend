import styles from "./IslandModal.module.css";
import { handlePasteImageUrl } from "../../../../lib/editor/handlers/handlePasteImage";

type ImagePasteUrlModalProps = {
    slideId: string | null;
    onClose: () => void;
};

export default function ImagePasteUrlModal({
    slideId,
    onClose,
}: ImagePasteUrlModalProps) {
    function handleApply() {
        console.log("Pasted image by url to slide:", slideId);
        onClose();
    }

    return (
        <div>
            <div className={styles.content}>
                <div className={styles.row}>
                    <span>URL изображения:</span>
                    <input
                        type="url"
                        onChange={(e) => handlePasteImageUrl(e.target.value)}
                    />
                </div>
            </div>
            <div className={styles.controlButtons}>
                <span className={styles.tool} onClick={handleApply}>
                    Применить
                </span>
                <span className={styles.tool} onClick={onClose}>
                    Отмена
                </span>
            </div>
        </div>
    );
}
