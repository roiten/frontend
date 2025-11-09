import styles from "./IslandModal.module.css";
import { handlePasteImageUrl } from "../handlers/handlePasteImage.ts";
import SquareButton from "../../Common/Button/SquareButton/SquareButton.tsx";
import { useState } from "react";

type ImagePasteUrlModalProps = {
    slideId: string | null;
    onClose: () => void;
};

export default function ImagePasteUrlModal({
    slideId,
    onClose,
}: ImagePasteUrlModalProps) {
    const [imageUrl, setImageUrl] = useState<string>('');

    function handleApply() {
        console.log("Apply bg: to slide:", slideId);
        if (imageUrl != "") {
            handlePasteImageUrl(imageUrl);
        }
        onClose();
    }

    return (
        <div>
            <div className={styles.content}>
                <div className={styles.row}>
                    <span>URL изображения:</span>
                    <input
                        type="url"
                        onChange={(e) => setImageUrl(e.target.value)}
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


