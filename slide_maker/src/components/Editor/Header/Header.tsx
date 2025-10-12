import styles from './Header.module.css';
import joinStyles from '../../../models/commonFunctions/joinStyle.ts';
import * as React from 'react';

type Props = {
    title: string;
};

export default function Header({ title }: Props) {
    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log('новое название:', event.target.value);
    };

    return (
        <div className={styles.header}>
            <img
                src={'./icons/siteIcon.png'}
                alt={'логотип слайдмейкера'}
                className={joinStyles([styles.siteLogo, styles.left])}
            />

            <div className={styles.center}>
                <input
                    type="text"
                    className={styles.title}
                    defaultValue={title}
                    onChange={handleTitleChange}
                />
            </div>

            <div className={styles.right}>
                <span className={styles.status}>Сохранено</span>
            </div>
        </div>
    );
}
