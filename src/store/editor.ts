import type { Editor } from './types.ts';
import { maxTest } from '../tests/tests.ts';

let editor: Editor = maxTest();
let editorChangeHandler: ((editor: Editor) => void) | null = null;

function getEditor() {
    return editor;
}

function setEditor(newEditor: Editor) {
    editor = newEditor;
}

function addEditorChangeHandler(handler: (editor: Editor) => void) {
    editorChangeHandler = handler;
}

function dispatch(modifyFn: any, ...args: any[]) {
    const newEditor = modifyFn(editor, ...args);
    setEditor(newEditor);
    if (editorChangeHandler) {
        editorChangeHandler(newEditor);
    }
}


export { getEditor, setEditor, addEditorChangeHandler, dispatch };
