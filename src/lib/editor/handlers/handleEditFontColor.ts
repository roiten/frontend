import { dispatch, getEditor } from '../../../store/editor.ts';
import { setTextColor } from '../../../store/types.ts';

function handleEditFontColor(textIds: string[], color: string) {
    const editor = getEditor();
    const slideId = editor.currentSlide;
    if (!slideId) return;

    const slide = editor.slides.find(s => s.id === slideId);
    if (!slide) return;

    console.log('New font color: ', color);
    for (const textId of textIds) {
        dispatch(setTextColor, slideId, textId, color);
    }
}

export { handleEditFontColor };
