import styles from './Workspace.module.css';
import { dispatch } from '../../../store/editor';
import { setTextDescription } from '../../../store/types.ts';
import type { Text } from '../../../store/types.ts';
import { type JSX } from 'react';
import * as React from 'react';

type Props = {
    obj: Text;
    slideId: string;
    onClick?: () => void;
};

export default function SlideTextObject({
    obj,
    slideId,
    onClick,
}: Props): JSX.Element {
    const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
        const newText = e.currentTarget.innerText;
        if (newText !== obj.description) {
            dispatch(setTextDescription, {
                slideId,
                textId: obj.id,
                description: newText,
            });
        }
    };

    return (
        <div
            className={styles.slideObject}
            style={{
                top: obj.position.y,
                left: obj.position.x,
                width: obj.size.width,
                color: obj.font.color,
                fontSize: obj.font.size,
                textDecoration: obj.font.textDecoration,
                fontFamily: obj.font.family,
            }}
            contentEditable
            onBlur={handleBlur}
            onClick={onClick}
        >
            {obj.description || 'Введите текст'}
        </div>
    );
}
