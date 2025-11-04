import styles from "./IslandModal.module.css";
import { handlePasteImageUrl } from "../handlers/handlePasteImage.ts";
import SquareButton from "../../Common/Button/SquareButton/SquareButton.tsx";

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
                <SquareButton tool={{name: 'Применить'}} onClick={handleApply} />
                <SquareButton tool={{name: 'Отмена'}} onClick={onClose} />
            </div>
        </div>
    );
}


