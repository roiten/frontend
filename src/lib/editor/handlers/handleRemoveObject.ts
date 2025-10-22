import { dispatch, getEditor } from "../../../store/editor.ts";
import { removeSlideObject } from "../../../store/actions.ts";

function handleRemoveObject(objectId: string) {
    const editor = getEditor();
    const slideId = editor.currentSlide;
    if (!slideId) return;

    const slide = editor.slides.find((s) => s.id === slideId);
    if (!slide) return;

    console.log("Removed: ", objectId);
    dispatch(removeSlideObject, slideId, objectId);
}

export { handleRemoveObject };
