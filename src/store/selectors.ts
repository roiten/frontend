import type { Text, Selection, Slide } from "./types";

const getTextObjectById = (
    selection: Selection,
    slides: Slide[],
    objectId: string,
): Text | null => {
    const currentSlide = selection.currentSlide;
    if (!currentSlide) return null;

    const current = slides.find((slide) => slide.id === currentSlide);
    if (!current) return null;

    const foundObject = current.content.find((obj) => obj.id === objectId);
    if (!foundObject || foundObject.type != "text") return null;
    return foundObject;
};

export {
    getTextObjectById,
}
