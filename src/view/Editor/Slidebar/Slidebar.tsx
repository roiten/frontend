import { type Slide } from "../../../store/types.ts";
import { slidebarTools } from "../Tools/toolsConfig.ts";
import SlidePreview from "./SlidePreview.tsx";
import RoundButton from "../Common/Button/RoundButton/RoundButton.tsx";
import styles from "./Slidebar.module.css";
import { dispatch, getEditor } from "../../../store/editor";
import { chooseSlide } from "../../../store/actions.ts";
import { useSlideMove } from "./hooks/useSlideMove.ts";

type Props = {
    currentSlideId: string | null;
};

export default function Slidebar({ currentSlideId }: Props) {
    const editor = getEditor();
    const { slides } = editor;

    const { dropIndex, isDragging, draggedSlideId, handleDragStart, handleDragOver } =
        useSlideMove();

    const handleSlideClick = (slide: Slide) => {
        dispatch(chooseSlide, slide.id);
    };

    const visibleSlides = (() => {
        if (!isDragging || dropIndex === null || !draggedSlideId) return slides;

        const startIndex = slides.findIndex((s) => s.id === draggedSlideId);
        if (startIndex === -1) return slides;

        const copy = [...slides];
        const [moved] = copy.splice(startIndex, 1);
        copy.splice(dropIndex, 0, moved);
        return copy;
    })();

    return (
        <div className={styles.slidebar}>
            <div className={styles.slidebarTools}>
                {slidebarTools.map((tool) => (
                    <RoundButton
                        key={tool.name}
                        tool={tool}
                        onClick={() => tool.action?.(currentSlideId)}
                    />
                ))}
            </div>

            <div className={styles.slidebarList}>
                {visibleSlides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`${styles.slideWrapper} ${
                            isDragging && slide.id === draggedSlideId
                                ? styles.draggingSlide
                                : ""
                        }`}
                    >
                        <SlidePreview
                            slide={slide}
                            isSelected={slide.id === currentSlideId}
                            index={index}
                            onClick={() => handleSlideClick(slide)}
                            onMouseDown={() => handleDragStart(slide.id)}
                            onMouseEnter={() => handleDragOver(index)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
