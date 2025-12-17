import type { Slide } from "../../../store/types.ts";
import styles from "./Slidebar.module.css";
import {
    PREVIEW_WIDTH,
    SLIDE_HEIGHT,
    SLIDE_WIDTH,
} from "../../../store/default.ts";
import joinStyles from "../../../../utils/joinStyle.ts";
import SlideRenderer from "../Slide/SlideRenderer.tsx";

type SlidePreviewProps = {
    slide: Slide;
    isSelected: boolean;
    index: number;
    onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
    onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
};

export default function SlidePreview({
    slide,
    index,
    isSelected,
    onClick,
    onMouseDown,
}: SlidePreviewProps) {
    const scale = PREVIEW_WIDTH / SLIDE_WIDTH;

    return (
        <div
            className={joinStyles([
                isSelected
                    ? joinStyles([styles.thumbnail, styles.thumbnailSelected])
                    : styles.thumbnail,
            ])}
            onClick={onClick}
            onMouseDown={(e) => {
                e.preventDefault();
                onMouseDown(e);
            }}
            style={{ width: PREVIEW_WIDTH }}
        >
            <div
                style={{
                    width: SLIDE_WIDTH * scale,
                    height: SLIDE_HEIGHT * scale,
                }}
            >
                <SlideRenderer slide={slide} scale={scale} mode="edit"/>
            </div>
            <span className={styles.thumbnailLabel}>Слайд {index + 1}</span>
        </div>
    );
}
