import type { Editor, Text } from "./types";

const getTextObjectById = (state: Editor, objectId: string): Text | null => {
    const currentSlide = state.currentSlide;
    if (!currentSlide) return null;

    const current = state.slides.find((slide) => slide.id === currentSlide);
    if (!current) return null;

    const foundObject = current.content.find((obj) => obj.id === objectId);
    if (!foundObject || foundObject.type != "text") return null;
    return foundObject;
}

export {
    getTextObjectById,
}
