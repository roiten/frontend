import type { Text } from "./types";
import type { RootState } from "./store.ts";

const getTextObjectById = (
    selection: RootState["selection"],
    slides: RootState["slides"],
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
