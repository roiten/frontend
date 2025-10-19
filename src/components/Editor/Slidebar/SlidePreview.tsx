import type { Slide } from '../../../store/types.ts';
import styles from './Slidebar.module.css';
import {
    PREVIEW_WIDTH,
    SLIDE_HEIGHT,
    SLIDE_WIDTH,
} from '../../../store/default.ts';
import joinStyles from '../../../lib/utils/joinStyle.ts';

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
                className={styles.scaledContainer}
                style={{ transform: `scale(${scale})` }}
            >
                <div
                    className={styles.background}
                    style={{
                        background:
                            slide.background.type === 'color'
                                ? slide.background.color
                                : `url(${slide.background.source}) center/cover`,
                        width: SLIDE_WIDTH,
                        height: SLIDE_HEIGHT,
                    }}
                />

                <div className={styles.thumbnailContent}>
                    {slide.content.map(obj =>
                        obj.type === 'text' ? (
                            <div
                                key={obj.id}
                                style={{
                                    top: obj.position.y,
                                    left: obj.position.x,
                                    width: obj.size.width,
                                    height: obj.size.height,
                                    color: obj.font.color,
                                    fontSize: obj.font.size,
                                    textDecoration: obj.font.textDecoration,
                                    fontFamily: obj.font.family,
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
                                    top: obj.position.y,
                                    left: obj.position.x,
                                    width: obj.size.width,
                                    height: obj.size.height,
                                    opacity: obj.transparency,
                                }}
                            />
                        )
                    )}
                </div>
            </div>

            <span className={styles.thumbnailLabel}>Слайд {index + 1}</span>
        </div>
    );
}
