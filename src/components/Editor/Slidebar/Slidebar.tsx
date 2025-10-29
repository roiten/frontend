import { type Slide } from "../../../store/types.ts";
import { slidebarTools } from "../Tools/toolsConfig.ts";
import SlidePreview from "./SlidePreview.tsx";
import RoundButton from "../Common/Button/RoundButton/RoundButton.tsx";
import styles from "./Slidebar.module.css";
import { dispatch, getEditor } from "../../../store/editor";
import { chooseSlide } from "../../../store/actions.ts";
import { useEffect, useState } from "react";

type Props = {
    slides: Slide[];
    currentSlideId: string | null;
};

export default function Slidebar({ currentSlideId }: Props) {
    const [, forceUpdate] = useState(0);
    const selectedSlideId = currentSlideId;
    const handleSlideClick = (slide: Slide) => {
        dispatch(chooseSlide, slide.id);
    };

    const editor = getEditor();

    useEffect(() => {
        forceUpdate(prev => prev + 1);
    }, [editor]);

    return (
        <div className={styles.slidebar}>
            <div className={styles.slidebarTools}>
                {slidebarTools.map((tool) => (
                    <RoundButton
                        key={tool.name}
                        tool={tool}
                        onClick={() => tool.action?.(selectedSlideId)}
                    />
                ))}
            </div>

            <div className={styles.slidebarList}>
                {editor.slides.map((slide, index) => (
                    <SlidePreview
                        key={slide.id}
                        slide={slide}
                        isSelected={slide.id === selectedSlideId}
                        index={index}
                        onClick={() => handleSlideClick(slide)}
                    />
                ))}
            </div>
        </div>
    );
}
