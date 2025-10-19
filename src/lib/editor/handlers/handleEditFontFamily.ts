import { dispatch, getEditor } from '../../../store/editor.ts';
import { setFontFamily } from '../../../store/types.ts';

function handleEditFontFamily(textIds: string[], family: string) {
    const editor = getEditor();
    const slideId = editor.currentSlide;
    if (!slideId) return;

    const slide = editor.slides.find(s => s.id === slideId);
    if (!slide) return;

    console.log('New font family: ', family);
    for (const textId of textIds) {
        dispatch(setFontFamily, slideId, textId, family);
    }
}

export { handleEditFontFamily };
