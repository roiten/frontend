import styles from "./IslandModal.module.css";
import SquareButton from "../../Common/Button/SquareButton/SquareButton.tsx";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSlideBackground } from "../../../../store/actionCreators.ts";
import type { Editor } from "../../../../store/types.ts";

type BackgroundModalProps = {
    onClose: () => void;
};

export default function BackgroundModal({ onClose }: BackgroundModalProps) {
    const editor = useSelector((state: Editor) => state);
    const dispatch = useDispatch();
    const [colorBackground, setColorBackground] = useState<string>("white");
    const [urlBackground, setUrlBackground] = useState<string>("");

    const handleEditSlideBackgroundColor = (color: string) => {
        const slideId = editor.currentSlide;
        if (!slideId) return;

        const slide = editor.slides.find((s) => s.id === slideId);
        if (!slide) return;

        dispatch(setSlideBackground(slideId, { type: "color", color: color }));
    };

    const handleEditSlideBackgroundImage = (url: string) => {
        const slideId = editor.currentSlide;
        if (!slideId) return;

        const slide = editor.slides.find((s) => s.id === slideId);
        if (!slide) return;

        dispatch(
            setSlideBackground(slideId, {
                type: "picture",
                source: url,
                transparency: 1,
            }),
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
