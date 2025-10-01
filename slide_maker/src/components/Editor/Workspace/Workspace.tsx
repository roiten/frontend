import type { Slide, SlideObject } from '../../../models/types.ts';
import './Workspace.css';

type Props = {
    slide: Slide | undefined;
};

export default function Workspace({ slide }: Props) {
    if (!slide) return <div className="editor__body">Нет выбранного слайда</div>;
    const backgroundStyle =
        slide.background.type === 'color'
            ? { backgroundColor: slide.background.color }
            : {
                backgroundImage: `url(${slide.background.source})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            };

    return (
        <div className="editor__body" style={{ position: 'relative', ...backgroundStyle }}>
            {slide.content.map((obj: SlideObject) => {
                if (obj.type === 'text') {
                    return (
                        <div
                            key={obj.id}
                            style={{
                                position: 'absolute',
                                top: `${(obj.position.y / 800) * 100}%`,
                                left: `${(obj.position.x / 1200) * 100}%`,
                                width: `${(obj.size.width / 1200) * 100}%`,
                                height: obj.size.height,
                                color: obj.font.color,
                                fontSize: obj.font.size,
                                fontFamily: obj.font.family,
                            }}
                            onClick={() => console.log('Нажат объект', obj.id, obj.font.color)}
                        >
                            {obj.description}
                        </div>
                    );
                } else if (obj.type === 'image') {
                    return (
                        <img
                            key={obj.id}
                            src={obj.source}
                            alt="Картинка на слайде"
                            style={{
                                position: 'absolute',
                                top: `${(obj.position.y / 800) * 100}%`,
                                left: `${(obj.position.x / 1200) * 100}%`,
                                width: `${(obj.size.width / 1200) * 100}%`,
                                height: `${(obj.size.height / 800) * 100}%`,
                                opacity: obj.transparency,
                            }}
                            onClick={() => console.log('Нажат объект', obj.id)}
                        />
                    );
                }
                return null;
            })}
        </div>
    );
}
