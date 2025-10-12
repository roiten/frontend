import type { Slide, SlideObject } from '../../../models/types.ts';

import styles from './Workspace.module.css';

import SlideTextObject from './SlideTextObject.tsx';
import SlideImageObject from './SlideImageObject.tsx';

type Props = {
    slide: Slide | undefined;
    scale?: number;
};


export default function Workspace({ slide, scale = 0.85 }: Props) {
    if (!slide)
        return <div className={styles.workspace}>Нет выбранного слайда</div>;

    const backgroundStyle =
        slide.background.type === 'color'
            ? { backgroundColor: slide.background.color }
            : {
                  backgroundImage: `url(${slide.background.source})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
              };

    return (
        <div className={styles.wrapper}>
            <div
                className={styles.scaledContainer}
                style={{ transform: `scale(${scale})` }}
            >
                <div className={styles.workspace} style={backgroundStyle}>
                    {slide.content.map((obj: SlideObject) => {
                        if (obj.type === 'text') {
                            return <SlideTextObject obj={obj} />;
                        } else if (obj.type === 'image') {
                            return <SlideImageObject obj={obj} />;
                        }
                        return null;
                    })}
                </div>
            </div>
        </div>
    );
}
