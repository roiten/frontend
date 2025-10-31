import styles from "./IslandModal.module.css";
import {
    handleEditSlideBackgroundColor,
    handleEditSlideBackgroundImage,
} from "../handlers/handleEditSlideBackground.ts";
import SquareButton from "../../Common/Button/SquareButton/SquareButton.tsx";
import { useState } from "react";

type BackgroundModalProps = {
    slideId: string | null;
    onClose: () => void;
};

export default function BackgroundModal({
    slideId,
    onClose,
}: BackgroundModalProps) {
    const [colorBackground, setColorBackground] = useState<string>("white");
    const [urlBackground, setUrlBackground] = useState<string>("");

    function reset() {
        setColorBackground("white");
        onClose();
    }

    function handleApply() {
        console.log("Apply bg: to slide:", slideId);
        if (urlBackground != "") {
            handleEditSlideBackgroundImage(urlBackground);
        } else {
            handleEditSlideBackgroundColor(colorBackground);
        }
        onClose();
    }

    return (
        <div>
            <div className={styles.content}>
                <div className={styles.row}>
                    <span>Цвет:</span>
                    <input
                        type="color"
                        onChange={(e) => setColorBackground(e.target.value)}
                    />
                </div>
                <div className={styles.row}>
                    <span>URL изображения:</span>
                    <input
                        type="url"
                        onChange={(e) => setUrlBackground(e.target.value)}
                    />
                </div>
            </div>
            <div className={styles.controlButtons}>
                <SquareButton
                    tool={{ name: "Применить" }}
                    onClick={handleApply}
                />
                <SquareButton tool={{ name: "Отмена" }} onClick={reset} />
            </div>
        </div>
    );
}
