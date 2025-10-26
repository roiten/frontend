import type { Slide } from "../../../store/types.ts";
import styles from "./Slidebar.module.css";
import {
    PREVIEW_WIDTH,
    SLIDE_HEIGHT,
    SLIDE_WIDTH,
} from "../../../store/default.ts";
import joinStyles from "../../../utils/joinStyle.ts";
import SlideRenderer from "../Slide/SlideRenderer.tsx";

type Props = {
    slide: Slide;
    index: number;
    isSelected: boolean;
    onClick: () => void;
};

export default function SlidePreview({
    slide,
    index,
    isSelected,
    onClick,
}: Props) {
    const scale = PREVIEW_WIDTH / SLIDE_WIDTH;

    return (
        <div
            className={
                isSelected
                    ? joinStyles([styles.thumbnail, styles.thumbnailSelected])
                    : styles.thumbnail
            }
            onClick={onClick}
            style={{ width: PREVIEW_WIDTH }}
        >
            <div
                style={{
                    width: SLIDE_WIDTH * scale,
                    height: SLIDE_HEIGHT * scale,
                }}
            >
                <SlideRenderer
                    slide={slide}
                    scale={scale}
                    selectedObjectIds={null}
                    onSelectObject={undefined}
                />
            </div>

            <span className={styles.thumbnailLabel}>Слайд {index + 1}</span>
        </div>
    );
}
