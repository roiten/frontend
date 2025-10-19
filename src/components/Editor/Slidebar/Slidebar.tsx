import { type Slide } from '../../../store/types.ts';
import { slidebarTools } from '../../../lib/editor/tools.ts';
import SlidePreview from './SlidePreview.tsx';
import styles from './Slidebar.module.css';
import { dispatch } from '../../../store/editor';
import { chooseSlide } from '../../../store/actions.ts';

type Props = {
    slides: Slide[];
    currentSlideId: string | null;
};

export default function Slidebar({ slides, currentSlideId }: Props) {
    const selectedSlideId = currentSlideId;
    const handleSlideClick = (slide: Slide) => {
        dispatch(chooseSlide, slide.id);
    };

    return (
        <div className={styles.slidebar}>
            <div className={styles.slidebarTools}>
                {slidebarTools.map(tool => (
                    <span
                        key={tool.name}
                        className={styles.slidebarTool}
                        onClick={() => tool.action?.(selectedSlideId)}
                    >
                        <img
                            className={styles.toolIcon}
                            alt={tool.name}
                            src={tool.icon}
                        />
                    </span>
                ))}
            </div>

            <div className={styles.slidebarList}>
                {slides.map((slide, index) => (
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
