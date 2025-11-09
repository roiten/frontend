import { dispatch, getEditor } from "../../../../store/editor.ts";
import { addSlideObject } from "../../../../store/actions.ts";
import { IMAGE_PRESETS } from "../../../../store/default.ts";
import { v4 as uuid } from "uuid";

function handlePasteImageUrl(url: string) {
    const editor = getEditor();
    const slideId = editor.currentSlide;
    if (!slideId) return;

    const slide = editor.slides.find((s) => s.id === slideId);
    if (!slide) return;

    console.log("New image url: ", url);
    dispatch(addSlideObject, slideId, {
        id: uuid(),
        source: url,
        ...IMAGE_PRESETS,
    });
}

export { handlePasteImageUrl };
