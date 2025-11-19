import styles from "./IslandModal.module.css";
import SquareButton from "../../Common/Button/SquareButton/SquareButton.tsx";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {setSlideBackground} from "../../../../store/reducers/slidesReducer.ts";
import type { RootState } from "../../../../store/store.ts";

type BackgroundModalProps = {
    onClose: () => void;
};

export default function BackgroundModal({ onClose }: BackgroundModalProps) {
    const selection = useSelector((state: RootState) => state.selection);
    const slides = useSelector((state: RootState) => state.slides);
    const dispatch = useDispatch();
    const [colorBackground, setColorBackground] = useState<string>("white");
    const [urlBackground, setUrlBackground] = useState<string>("");

    const handleEditSlideBackgroundColor = (color: string) => {
        const slideId = selection.currentSlide;
        if (!slideId) return;

        const slide = slides.find((s) => s.id === slideId);
        if (!slide) return;

        dispatch(setSlideBackground({ slideId, background: { type: "color", color: color } }));    };

    const handleEditSlideBackgroundImage = (url: string) => {
        const slideId = selection.currentSlide;
        if (!slideId) return;

        const slide = slides.find((s) => s.id === slideId);
        if (!slide) return;

        dispatch(
            setSlideBackground({slideId, background: {
                type: "picture",
                source: url,
                transparency: 1,
            }}),
        );
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
