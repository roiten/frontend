import type { Slide } from '../../../models/types.ts';
import { slidebarTools } from '../../../constants/toolNames.ts';
import SlidePreview from './SlidePreview.tsx';
import './Slidebar.css';

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
        <div className="editor__slidebar">
            <div className="slidebar__tools">
                {slidebarTools.map((tool) => (
                    <span
                        key={tool.name}
                        className="slidebar__tool"
                        onClick={() => handleToolChoose(tool.name)}
                    >
                        <img className={'tool__icon'} src={tool.icon} />
                    </span>
                ))}
            </div>

            <div className="slidebar__list">
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
