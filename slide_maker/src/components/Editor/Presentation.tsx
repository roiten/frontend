import styles from './Editor.module.css';

import type { Presentation } from '../../models/types.ts';
import Header from './Header/Header.tsx';
import Infobar from './Infobar/Infobar.tsx';
import Slidebar from './Slidebar/Slidebar.tsx';
import Tools from './Tools/Tools.tsx';
import Workspace from './Workspace/Workspace.tsx';
import type { JSX } from 'react';

type PresentationProps = {
    presentation: Presentation;
};

export default function Presentation({
    presentation,
}: PresentationProps): JSX.Element {
    const currentSlide = presentation.slides.find(
        s => s.id === presentation.currentSlide
    );

    return (
        <div className={styles.editor}>
            <Header title={presentation.title} />
            <Tools />

            <div className={styles.main}>
                <Slidebar slides={presentation.slides} />
                <Workspace slide={currentSlide} />
            </div>

            <Infobar
                author={presentation.author}
                createdAt={presentation.createdAt}
                editedAt={presentation.editedAt}
            />
        </div>
    );
}
