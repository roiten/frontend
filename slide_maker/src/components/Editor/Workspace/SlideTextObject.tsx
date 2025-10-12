import styles from './Workspace.module.css';

import type { Text } from '../../../models/types.ts';
import type { JSX } from 'react';

type Props = {
    obj: Text;
};

export default function SlideTextObject({ obj }: Props): JSX.Element {
    return (
        <div
            className={styles.slideObject}
            key={obj.id}
            style={{
                top: obj.position.y,
                left: obj.position.x,
                width: obj.size.width,
                color: obj.font.color,
                fontSize: obj.font.size,
                textDecoration: obj.font.textDecoration,
                fontFamily: obj.font.family,
            }}
        >
            {obj.description}
        </div>
    );
}
