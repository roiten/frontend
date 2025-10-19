import styles from './Editor.module.css';

import type { Editor } from '../../store/types.ts';
import { dispatch } from '../../store/editor.ts';
import {
    addSelectedObject,
    removeSelectedObject,
    clearSelectedObjects,
} from '../../store/actions.ts';

import Header from './Header/Header.tsx';
import Infobar from './Infobar/Infobar.tsx';
import Slidebar from './Slidebar/Slidebar.tsx';
import Tools from './Tools/Tools.tsx';
import Workspace from './Workspace/Workspace.tsx';
import { type JSX } from 'react';

type PresentationProps = {
    editor: Editor;
};

function handleSelectObject(objectId: string, isSelected: boolean) {
    if (isSelected) {
        dispatch(addSelectedObject, objectId);
    } else {
        dispatch(removeSelectedObject, objectId);
    }
}

function handleClearSelection() {
    dispatch(clearSelectedObjects);
}

export default function Presentation({
    editor,
}: PresentationProps): JSX.Element {
    const currentSlide = editor.slides.find(s => s.id === editor.currentSlide);
    const selectedObjects = editor.selectedObjects;

    return (
        <div className={styles.editor}>
            <Header title={editor.title} />
            <Tools selectedObjects={selectedObjects} />

            <div className={styles.main}>
                <Slidebar
                    slides={editor.slides}
                    currentSlideId={editor.currentSlide}
                />
                <Workspace
                    slide={currentSlide}
                    selectedObjects={selectedObjects}
                    onSelectObject={handleSelectObject}
                    onClearSelection={handleClearSelection}
                />
            </div>

            <Infobar
                author={editor.author}
                createdAt={editor.createdAt}
                editedAt={editor.editedAt}
            />
        </div>
    );
}
