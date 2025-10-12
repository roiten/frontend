import type { Slide } from '../../../models/types.ts';
import { slidebarTools } from '../../../constants/toolNames.ts';
import SlidePreview from './SlidePreview.tsx';
import styles from './Slidebar.module.css';

type Props = {
    slides: Slide[];
};

export default function Slidebar({ slides }: Props) {
    const handleToolChoose = (tool: string) => {
        console.log('выбран инструмент: ', tool);
    };

    const handleSlideClick = (slide: Slide, index: number) => {
        console.log('Слайд: ', slide.id, 'Порядковый номер: ', index + 1);
    };

    return (
        <div className={styles.slidebar}>
            <div className={styles.slidebarTools}>
                {slidebarTools.map(tool => (
                    <span
                        key={tool.name}
                        className={styles.slidebarTool}
                        onClick={() => handleToolChoose(tool.name)}
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
                        index={index}
                        onClick={() => handleSlideClick(slide, index)}
                    />
                ))}
            </div>
        </div>
    );
}
