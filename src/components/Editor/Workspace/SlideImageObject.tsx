import styles from './Workspace.module.css';

import type { Image } from '../../../store/types.ts';
import type { JSX } from 'react';

type Props = {
    obj: Image;
    onClick?: () => void;
};

export default function SlideImageObject({ obj }: Props): JSX.Element {
    return (
        <img
            className={styles.slideObject}
            src={obj.source}
            alt="Картинка на слайде"
            style={{
                top: obj.position.y,
                left: obj.position.x,
                width: obj.size.width,
                height: obj.size.height,
                opacity: obj.transparency,
            }}
        />
    );
}
