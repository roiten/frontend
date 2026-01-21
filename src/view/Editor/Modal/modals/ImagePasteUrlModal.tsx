import styles from "./IslandModal.module.css";
import SquareButton from "../../Common/Button/SquareButton/SquareButton.tsx";
import { useState } from "react";
import { addSlideObject } from "../../../../store/reducers/slidesReducer.ts";
import { v4 as uuid } from "uuid";
import { IMAGE_PRESETS } from "../../../../store/default.ts";
import { useAppSelector, useAppDispatch } from "../../../../store/store.ts";
import { loadAlienURL } from "../../../../store/appWrite/api.ts";

type ImagePasteUrlModalProps = {
    onClose: () => void;
};

export default function ImagePasteUrlModal({
    onClose,
}: ImagePasteUrlModalProps) {
    const selection = useAppSelector((state) => state.editor.present.selection);
    const dispatch = useAppDispatch();
    const [imageUrl, setImageUrl] = useState<string>("");
    const handlePasteImageUrl = async (url: string) => {
        const storageURL = await loadAlienURL(url);
        if (!storageURL) return;
        
        const slideId = selection.currentSlide;
        if (!slideId) return;

        const img = new Image();
        img.onload = () => {
            const naturalWidth = img.naturalWidth;
            const naturalHeight = img.naturalHeight;

            const MAX_WIDTH = 1200;
            const MAX_HEIGHT = 800;

            const scale = Math.min(
                MAX_WIDTH / naturalWidth,
                MAX_HEIGHT / naturalHeight,
                1,
            );
            const width = naturalWidth * scale;
            const height = naturalHeight * scale;

            dispatch(
                addSlideObject({
                    slideId,
                    obj: {
                        ...IMAGE_PRESETS,
                        id: uuid(),
                        source: storageURL,
                        size: { width, height },
                    },
                }),
            );
        };

        img.src = url;
    };

    function handleApply() {
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
                <SquareButton
                    tool={{ name: "Применить" }}
                    onClick={handleApply}
                />
                <SquareButton tool={{ name: "Отмена" }} onClick={onClose} />
            </div>
        </div>
    );
}
