import { type Slide } from "../../../store/types.ts";
import { slidebarTools } from "../Tools/toolsConfig.ts";
import SlidePreview from "./SlidePreview.tsx";
import RoundButton from "../Common/Button/RoundButton/RoundButton.tsx";
import styles from "./Slidebar.module.css";
import { dispatch, getEditor } from "../../../store/editor";
import { chooseSlide } from "../../../store/actions.ts";
import { useEffect, useState } from "react";
import {useSlideMove} from "./hooks/useSlideMove.ts";

type Props = {
    currentSlideId: string | null;
};

export default function Slidebar({ currentSlideId }: Props) {
    const editor = getEditor();
    const { slides } = editor;

    const {
        dropIndex,
        isDragging,
        handleDragStart,
        handleDragOver,
    } = useSlideMove();

    const handleSlideClick = (slide: Slide) => {
        dispatch(chooseSlide, slide.id);
    };

    const [updateState, forceUpdate] = useState(0);
    useEffect(() => {
        forceUpdate(updateState + 1);
    }, [editor]);

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
                {slides.map((slide, index) => (
                    <div key={slide.id}>
                        {isDragging && dropIndex === index && (
                            <div className={styles.moveLine} />
                        )}

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

                {isDragging && dropIndex === slides.length && (
                    <div className={styles.moveLine} />
                )}
            </div>
        </div>
    );
}