import styles from "./IslandModal.module.css";
import {
    handleEditSlideBackgroundColor,
    handleEditSlideBackgroundImage,
} from "../handlers/handleEditSlideBackground.ts";
import SquareButton from "../../Common/Button/SquareButton/SquareButton.tsx";

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
                <SquareButton tool={{name: 'Применить'}} onClick={handleApply} />
                <SquareButton tool={{name: 'Отмена'}} onClick={onClose} />
            </div>
        </div>
    );
}
