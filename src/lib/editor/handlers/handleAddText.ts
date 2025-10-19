import { dispatch, getEditor } from '../../../store/editor.ts';
import { addSlideObject, type SlideObject } from '../../../store/types.ts';
import { TEXT_PRESETS } from '../../../store/default.ts';

function handleAddText() {
    const editor = getEditor();
    const slideId = editor.currentSlide;
    if (!slideId) return;

    const slide = editor.slides.find(s => s.id === slideId);
    if (!slide) return;

    const newText: SlideObject = {
        id: `text_${Date.now()}`,
        ...TEXT_PRESETS,
    };
    console.log('Added: ', newText);
    dispatch(addSlideObject, slideId, newText);
}

export { handleAddText };
