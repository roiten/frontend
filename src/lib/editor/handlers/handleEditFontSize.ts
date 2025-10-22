import { dispatch, getEditor } from "../../../store/editor.ts";
import { setTextSize } from "../../../store/types.ts";

function handleEditFontSize(textIds: string[], size: number) {
    const editor = getEditor();
    const slideId = editor.currentSlide;
    if (!slideId) return;

    const slide = editor.slides.find((s) => s.id === slideId);
    if (!slide) return;

    console.log("New font size: ", size);
    for (const textId of textIds) {
        dispatch(setTextSize, slideId, textId, size);
    }
}

export { handleEditFontSize };
