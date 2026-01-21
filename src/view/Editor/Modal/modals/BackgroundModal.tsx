import styles from "./IslandModal.module.css";
import SquareButton from "../../Common/Button/SquareButton/SquareButton.tsx";
import { useState } from "react";
import { editSlideBackground } from "../../../../store/reducers/slidesReducer.ts";
import { useAppDispatch, useAppSelector } from "../../../../store/store.ts";
import { loadAlienURL } from "../../../../store/appWrite/api.ts";

type BackgroundModalProps = {
    onClose: () => void;
};

export default function BackgroundModal({ onClose }: BackgroundModalProps) {
    const selection = useAppSelector((state) => state.editor.present.selection);
    const slides = useAppSelector((state) => state.editor.present.slides);
    const dispatch = useAppDispatch();
    const [colorBackground, setColorBackground] = useState<string>("white");
    const [urlBackground, setUrlBackground] = useState<string>("");

    const handleEditSlideBackgroundColor = (color: string) => {
        const slideId = selection.currentSlide;
        if (!slideId) return;

        dispatch(
            editSlideBackground({
                slideId,
                background: { type: "color", color: color },
            }),
        );
    };
const handleEditSlideBackgroundImage = async (url: string) => {
    try {
        const storageURL = await loadAlienURL(url);
        if (!storageURL) return;

        const slideId = selection.currentSlide;
        if (!slideId) return;

        const slide = slides.find((s) => s.id === slideId);
        if (!slide) return;

        dispatch(
            editSlideBackground({
                slideId,
                background: {
                    type: "picture",
                    source: storageURL,
                    transparency: 1,
                },
            }),
        );
    } catch (error) {
        console.error("Ошибка обновления фона:", error);
    }
};

    function reset() {
        setColorBackground("white");
        onClose();
    }

    function handleApply() {
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
