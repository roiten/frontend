import styles from "./IslandModal.module.css";
import {
    handleEditSlideBackgroundColor,
    handleEditSlideBackgroundImage,
} from "../../../../lib/editor/handlers/handleEditSlideBackground";

type BackgroundModalProps = {
    slideId: string | null;
    onClose: () => void;
};

export default function BackgroundModal({
    slideId,
    onClose,
}: BackgroundModalProps) {
    function handleApply() {
        console.log("Apply bg: to slide:", slideId);
        onClose();
    }

    return (
        <div>
            <div className={styles.content}>
                <div className={styles.row}>
                    <span>Цвет:</span>
                    <input
                        type="color"
                        onChange={(e) =>
                            handleEditSlideBackgroundColor(e.target.value)
                        }
                    />
                </div>
                <div className={styles.row}>
                    <span>URL изображения:</span>
                    <input
                        type="url"
                        onChange={(e) =>
                            handleEditSlideBackgroundImage(e.target.value)
                        }
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
