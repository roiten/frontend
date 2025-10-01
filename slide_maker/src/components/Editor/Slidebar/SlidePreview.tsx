import type { Slide } from '../../../models/types.ts';

type Props = {
    slide: Slide;
    index: number;
    onClick: () => void;
};

export default function SlidePreview({ slide, index, onClick }: Props) {
    return (
        <div className="slidebar__block" onClick={onClick} style={{ position: 'relative' }}>
            <div
                className="slidebar__block-background"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background:
                        slide.background.type === 'color'
                            ? slide.background.color
                            : `url(${slide.background.source}) no-repeat center/cover`,
                    borderRadius: '20px',
                    zIndex: 0,
                }}
            />

            <div className="slidebar__block-content">
                {slide.content.map((obj) =>
                    obj.type === 'text' ? (
                        <div
                            key={obj.id}
                            style={{
                                position: 'absolute',
                                top: obj.position.y / 10,
                                left: obj.position.x / 10,
                                width: obj.size.width / 10,
                                height: obj.size.height / 10,
                                color: obj.font.color,
                                fontSize: obj.font.size / 5,
                                fontFamily: obj.font.family,
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                zIndex: 1,
                            }}
                        >
                            {obj.description}
                        </div>
                    ) : (
                        <img
                            key={obj.id}
                            src={obj.source}
                            alt=""
                            style={{
                                position: 'absolute',
                                top: obj.position.y / 10,
                                left: obj.position.x / 10,
                                width: obj.size.width / 10,
                                height: obj.size.height / 10,
                                opacity: obj.transparency,
                                zIndex: 1,
                            }}
                        />
                    )
                )}
            </div>

            <span
                className="slidebar__block-label"
                style={{
                    position: 'absolute',
                    bottom: 2,
                    width: '100%',
                    textAlign: 'center',
                    fontSize: '0.7rem',
                    color: '#333',
                    zIndex: 2,
                }}
            >
        Слайд {index + 1}
      </span>
        </div>
    );
}
