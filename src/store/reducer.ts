import * as types from './actionTypes';
import type { Editor, EditorAction, Slide, SlideObject } from "./types";
import { DEFAULT_PRESENTATION } from "./default.ts";

function addSlideToEditor(state: Editor, slide: Slide): Editor {
    const currentSlide = state.currentSlide;
    if (currentSlide) {
        const currentIndex = state.slides.findIndex((s) => s.id === currentSlide);
        if (currentIndex === -1) return state;
        const newSlides = [...state.slides];
        newSlides.splice(currentIndex + 1, 0, slide);
        return { ...state, slides: newSlides, editedAt: new Date() };
    } else {
        return { ...state, slides: [...state.slides, slide], editedAt: new Date() };
    }
}

function moveSlideInEditor(state: Editor, slideIds: string[], newIndex: number): Editor {
    const slides = state.slides.map(s => ({ ...s }));

    const draggedSlides: Slide[] = [];
    const indicesToRemove: number[] = [];

    for (const id of slideIds) {
        const index = slides.findIndex(s => s.id === id);
        if (index === -1) continue;
        draggedSlides.push({ ...slides[index] });
        indicesToRemove.push(index);
    }

    if (draggedSlides.length === 0) return state;

    const sortedRemoveIndices = [...indicesToRemove].sort((a, b) => b - a);
    for (const index of sortedRemoveIndices) {
        slides.splice(index, 1);
    }

    slides.splice(newIndex, 0, ...draggedSlides);

    return {
        ...state,
        slides,
        editedAt: new Date(),
    };
}

function addSlideObjectToSlide(slide: Slide, obj: SlideObject): Slide {
    return { ...slide, content: [...slide.content, obj] };
}

function removeSlideObjectFromSlide(slide: Slide, objectId: string): Slide {
    return {
        ...slide,
        content: slide.content.filter((obj) => obj.id !== objectId),
    };
}

function setTextSizeToSlide(slide: Slide, textId: string, size: number): Slide {
    const content = slide.content.map((obj) =>
        obj.type === "text" && obj.id === textId
            ? { ...obj, font: { ...obj.font, size } }
            : obj,
    );
    return { ...slide, content };
}

function setTextFontToSlide(slide: Slide, textId: string, family: string): Slide {
    const content = slide.content.map((obj) =>
        obj.type === "text" && obj.id === textId
            ? { ...obj, font: { ...obj.font, family } }
            : obj,
    );
    return { ...slide, content };
}

function setTextColorToSlide(slide: Slide, textId: string, color: string): Slide {
    const content = slide.content.map((obj) =>
        obj.type === "text" && obj.id === textId
            ? { ...obj, font: { ...obj.font, color } }
            : obj,
    );
    return { ...slide, content };
}

export function editorReducer(state: Editor = DEFAULT_PRESENTATION, action: EditorAction): Editor {
    switch (action.type) {
        case types.SET_PRESENTATION_TITLE:
            return { ...state, title: action.payload, editedAt: new Date() };

        case types.ADD_SLIDE:
            return addSlideToEditor(state, action.payload);

        case types.REMOVE_SLIDES: {
            const slideIds = action.payload as string[];
            const otherSlides = state.slides.filter(s => !slideIds.includes(s.id));
            return { ...state, slides: otherSlides, editedAt: new Date() };
        }

        case types.MOVE_SLIDE: {
            const { slideIds, newIndex } = action.payload;
            return moveSlideInEditor(state, slideIds, newIndex);
        }

        case types.ADD_SLIDE_OBJECT: {
            const { slideId, obj } = action.payload;
            const slide = state.slides.find(s => s.id === slideId);
            if (!slide) return state;
            const updatedSlide = addSlideObjectToSlide(slide, obj);
            const slides = state.slides.map(s => s.id === slideId ? updatedSlide : s);
            return { ...state, slides, editedAt: new Date() };
        }

        case types.REMOVE_SLIDE_OBJECT: {
            const { slideId, objectId } = action.payload;
            const slide = state.slides.find(s => s.id === slideId);
            if (!slide) return state;
            const updatedSlide = removeSlideObjectFromSlide(slide, objectId);
            const slides = state.slides.map(s => s.id === slideId ? updatedSlide : s);
            return { ...state, slides, editedAt: new Date() };
        }

        case types.SET_OBJECT_POSITION_COORDINATES: {
            const { slideId, slideObject, position } = action.payload;
            const slide = state.slides.find(s => s.id === slideId);
            if (!slide) return state;

            const newObject = {
                ...slideObject,
                position: { ...slideObject.position, ...position },
            };

            const newContent = slide.content.map(obj =>
                obj.id === slideObject.id ? newObject : obj
            );

            const newSlide = { ...slide, content: newContent };
            const newSlides = state.slides.map(s =>
                s.id === slideId ? newSlide : s
            );

            return { ...state, slides: newSlides, editedAt: new Date() };
        }

        case types.SET_OBJECT_POSITION_SIZE: {
            const { slideId, slideObject, position, size } = action.payload;
            const slide = state.slides.find(s => s.id === slideId);
            if (!slide) return state;

            const newObject = {
                ...slideObject,
                size: { ...slideObject.size, ...size },
                position: { ...slideObject.position, ...position },
            };

            const newContent = slide.content.map(obj =>
                obj.id === slideObject.id ? newObject : obj
            );

            const newSlide = { ...slide, content: newContent };
            const newSlides = state.slides.map(s =>
                s.id === slideId ? newSlide : s
            );

            return { ...state, slides: newSlides, editedAt: new Date() };
        }

        case types.SET_TEXT_SIZE: {
            const { slideId, textId, size } = action.payload;
            const slide = state.slides.find(s => s.id === slideId);
            if (!slide) return state;
            const updatedSlide = setTextSizeToSlide(slide, textId, size);
            const slides = state.slides.map(s => s.id === slideId ? updatedSlide : s);
            return { ...state, slides, editedAt: new Date() };
        }

        case types.SET_FONT_FAMILY: {
            const { slideId, textId, family } = action.payload;
            const slide = state.slides.find(s => s.id === slideId);
            if (!slide) return state;
            const updatedSlide = setTextFontToSlide(slide, textId, family);
            const slides = state.slides.map(s => s.id === slideId ? updatedSlide : s);
            return { ...state, slides, editedAt: new Date() };
        }

        case types.SET_TEXT_COLOR: {
            const { slideId, textId, color } = action.payload;
            const slide = state.slides.find(s => s.id === slideId);
            if (!slide) return state;
            const updatedSlide = setTextColorToSlide(slide, textId, color);
            const slides = state.slides.map(s => s.id === slideId ? updatedSlide : s);
            return { ...state, slides, editedAt: new Date() };
        }

        case types.SET_TEXT_DESCRIPTION: {
            const { slideId, textId, description } = action.payload;
            const slides = state.slides.map(slide => {
                if (slide.id !== slideId) return slide;
                const content = slide.content.map(obj =>
                    obj.type === "text" && obj.id === textId
                        ? { ...obj, description }
                        : obj
                );
                return { ...slide, content };
            });
            return { ...state, slides, editedAt: new Date() };
        }

        case types.SET_SLIDE_BACKGROUND: {
            const { slideId, background } = action.payload;
            const updatedSlides = state.slides.map(slide =>
                slide.id === slideId ? { ...slide, background } : slide
            );
            return { ...state, slides: updatedSlides, editedAt: new Date() };
        }

        case types.CHOOSE_SLIDE: {
            const slideId = action.payload;
            if (state.slides.some(s => s.id === slideId)) {
                return { ...state, currentSlide: slideId };
            }
            return state;
        }

        case types.SET_SELECTED_OBJECTS:
            return { ...state, selectedObjects: action.payload, editedAt: new Date() };

        case types.ADD_SELECTED_OBJECT: {
            const objectId = action.payload;
            const current = state.selectedObjects || [];
            if (current.includes(objectId)) return state;
            return {
                ...state,
                selectedObjects: [...current, objectId],
                editedAt: new Date(),
            };
        }

        case types.REMOVE_SELECTED_OBJECT: {
            const objectId = action.payload;
            const current = state.selectedObjects;
            if (!current) return state;
            const newSelection = current.filter(id => id !== objectId);
            return {
                ...state,
                selectedObjects: newSelection.length > 0 ? newSelection : null,
                editedAt: new Date(),
            };
        }

        case types.CLEAR_SELECTED_OBJECTS:
            return { ...state, selectedObjects: null, editedAt: new Date() };

        case types.OPEN_PRESENTATION:
            return { ...action.payload };

        default:
            return state;
    }
}