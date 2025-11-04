import { dispatch, getEditor } from "../../../../store/editor.ts";
import { setSlideBackground } from "../../../../store/actions.ts";

function handleEditSlideBackgroundColor(color: string) {
    const editor = getEditor();
    const slideId = editor.currentSlide;
    if (!slideId) return;

    const slide = editor.slides.find((s) => s.id === slideId);
    if (!slide) return;

    console.log("New bg color: ", color);
    dispatch(setSlideBackground, slideId, { type: "color", color: color });
}

function handleEditSlideBackgroundImage(url: string) {
    const editor = getEditor();
    const slideId = editor.currentSlide;
    if (!slideId) return;

    const slide = editor.slides.find((s) => s.id === slideId);
    if (!slide) return;

    console.log("New bg color: ", url);
    dispatch(setSlideBackground, slideId, {
        type: "picture",
        source: url,
        transparency: 1,
    });
}

export { handleEditSlideBackgroundColor, handleEditSlideBackgroundImage };
