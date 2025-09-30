import type { Presentation, SlideObject, Slide } from './types.ts';
import {editTools, saveTools, slidebarTools} from '../constants/toolNames.ts';

type PresentationProps = {
    presentation: Presentation;
};

export default function Presentation({ presentation }: PresentationProps) {
    const currentSlide = presentation.slides.find((s) => s.id === presentation.currentSlide);

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log('новое название: ', event.target.value);
    };

    const handleToolChoose = (tool: string) => {
        console.log('выбран инструмент: ', tool);
    };

    const handleSlideClick = (slide: Slide, index: number) => {
        console.log('Слайд: ', slide.id, 'Порядковый номер: ', index + 1);
    };

    return (
        <div className="editor">
            <div className="editor__header">
                <input
                    className="editor__title"
                    type="text"
                    defaultValue={presentation.title}
                    onChange={handleTitleChange}
                />
            </div>

            <div className="editor__tools">

            <div className="tools__action">
                {saveTools.map((tool) => (
                    <span
                        key={tool.name}
                        className="tool"
                        onClick={() => handleToolChoose(tool.name)}
                    >
                        <img className={"tool__icon"} src={tool.icon}/>
                        <span className="tool__name">{tool.name}</span>
                    </span>
                ))}
            </div>

            <div className="tools__action">
                {editTools.map((tool) => (
                    <span
                        key={tool.name}
                        className="tool"
                        onClick={() => handleToolChoose(tool.name)}
                    >
                        <img className={"tool__icon"} src={tool.icon}/>
                        <span className="tool__name">{tool.name}</span>
                    </span>
                ))}
            </div>

            </div>

            <div className="editor__workspace">
                <div className="editor__slidebar">
                    <div className="slidebar__tools">
                        {slidebarTools.map((tool) => (
                            <span
                                key={tool.name}
                                className="slidebar__tool"
                                onClick={() => handleToolChoose(tool.name)}
                            >
                        <img className={"tool__icon"} src={tool.icon}/>
                    </span>
                        ))}
                    </div>

                    <div className="slidebar__list">
                        {presentation.slides.map((slide, index) => (
                            <div
                                key={slide.id}
                                className="slidebar__block"
                                onClick={() => handleSlideClick(slide, index)}
                            >
                                <span>Слайд {index + 1}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="editor__body">
                    {currentSlide?.content.map((obj) => {
                        if (obj.type === 'text') {
                            return (
                                <div
                                    key={obj.id}
                                    style={{
                                        position: 'absolute',
                                        top: obj.position.y,
                                        left: obj.position.x,
                                        width: obj.size.width,
                                        height: obj.size.height,
                                        color: obj.font.color,
                                        fontSize: obj.font.size,
                                        fontFamily: obj.font.family,
                                    }}
                                    onClick={() =>
                                        console.log('Object clicked', obj.id, obj.font.color)
                                    }
                                >
                                    {obj.description}
                                </div>
                            );
                        } else if (obj.type === 'image') {
                            return (
                                <img
                                    key={obj.id}
                                    src={obj.source}
                                    alt=""
                                    style={{
                                        position: 'absolute',
                                        top: obj.position.y,
                                        left: obj.position.x,
                                        width: obj.size.width,
                                        height: obj.size.height,
                                        opacity: obj.transparency,
                                    }}
                                    onClick={() => console.log('Object clicked', obj.id)}
                                />
                            );
                        }
                        return null;
                    })}
                </div>
            </div>
            <div className="editor__infobar">
                <span>Автор: {presentation.author}</span>
                <span>Создано: {presentation.createdAt.toString()}</span>
                <span>Изменено: {presentation.editedAt.toString()}</span>
            </div>
        </div>
    );
}
