import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Slide, SlideObject, Background, Editor } from "../types";

const initialState: Slide[] = [];

const slidesReducer = createSlice({
    name: "slides",
    initialState,
    reducers: {
        addSlide(state, action: PayloadAction<Slide>) {
            // ✅ push → new array via immer
            state.push(action.payload);
        },

        removeSlides(state, action: PayloadAction<string[]>) {
            const idsToRemove = new Set(action.payload);
            return state.filter((s) => !idsToRemove.has(s.id));
        },

        moveSlide(
            state,
            action: PayloadAction<{ slideIds: string[]; newIndex: number }>,
        ) {
            const { slideIds, newIndex } = action.payload;
            const dragged: Slide[] = [];
            const toRemove: number[] = [];
            for (const id of slideIds) {
                const i = state.findIndex((s) => s.id === id);
                if (i !== -1) {
                    dragged.push({ ...state[i] });
                    toRemove.push(i);
                }
            }
            if (dragged.length === 0) return state;
            for (const i of toRemove.sort((a, b) => b - a)) {
                state.splice(i, 1);
            }
            state.splice(newIndex, 0, ...dragged);
        },

        addSlideObject(
            state,
            action: PayloadAction<{ slideId: string; obj: SlideObject }>,
        ) {
            const { slideId, obj } = action.payload;
            return state.map(slide =>
                slide.id === slideId
                    ? { ...slide, content: [...slide.content, obj] }
                    : slide
            );
        },

        setSlideBackground(
            state,
            action: PayloadAction<{ slideId: string; background: Background }>,
        ) {
            const { slideId, background } = action.payload;
            return state.map(slide =>
                slide.id === slideId
                    ? { ...slide, background: { ...background } }
                    : slide
            );
        },

        removeSlideObject(
            state,
            action: PayloadAction<{ slideId: string; objectId: string }>,
        ) {
            const { slideId, objectId } = action.payload;
            return state.map(slide =>
                slide.id === slideId
                    ? {
                        ...slide,
                        content: slide.content.filter((o) => o.id !== objectId),
                    }
                    : slide
            );
        },

        editObjectPositionCoordinates(
            state,
            action: PayloadAction<{
                slideId: string;
                slideObject: SlideObject;
                position: { x: number; y: number };
            }>,
        ) {
            const { slideId, slideObject, position } = action.payload;
            return state.map(slide =>
                slide.id === slideId
                    ? {
                        ...slide,
                        content: slide.content.map(obj =>
                            obj.id === slideObject.id
                                ? { ...obj, position: { ...position } }
                                : obj
                        ),
                    }
                    : slide
            );
        },

        editObjectPositionSize(
            state,
            action: PayloadAction<{
                slideId: string;
                slideObject: SlideObject;
                position: { x: number; y: number };
                size: { width: number; height: number };
            }>,
        ) {
            const { slideId, slideObject, position, size } = action.payload;
            return state.map(slide =>
                slide.id === slideId
                    ? {
                        ...slide,
                        content: slide.content.map(obj =>
                            obj.id === slideObject.id
                                ? {
                                    ...obj,
                                    position: { ...position },
                                    size: { ...size },
                                }
                                : obj
                        ),
                    }
                    : slide
            );
        },

        editTextSize(
            state,
            action: PayloadAction<{
                slideId: string;
                textId: string;
                size: number;
            }>,
        ) {
            const { slideId, textId, size } = action.payload;
            return state.map(slide =>
                slide.id === slideId
                    ? {
                        ...slide,
                        content: slide.content.map(obj =>
                            obj.id === textId && obj.type === "text"
                                ? { ...obj, font: { ...obj.font, size } }
                                : obj
                        ),
                    }
                    : slide
            );
        },

        setFontFamily(
            state,
            action: PayloadAction<{
                slideId: string;
                textId: string;
                family: string;
            }>,
        ) {
            const { slideId, textId, family } = action.payload;
            return state.map(slide =>
                slide.id === slideId
                    ? {
                        ...slide,
                        content: slide.content.map(obj =>
                            obj.id === textId && obj.type === "text"
                                ? { ...obj, font: { ...obj.font, family } }
                                : obj
                        ),
                    }
                    : slide
            );
        },

        editTextColor(
            state,
            action: PayloadAction<{
                slideId: string;
                textId: string;
                color: string;
            }>,
        ) {
            const { slideId, textId, color } = action.payload;
            return state.map(slide =>
                slide.id === slideId
                    ? {
                        ...slide,
                        content: slide.content.map(obj =>
                            obj.id === textId && obj.type === "text"
                                ? { ...obj, font: { ...obj.font, color } }
                                : obj
                        ),
                    }
                    : slide
            );
        },

        editTextDescription(
            state,
            action: PayloadAction<{
                slideId: string;
                textId: string;
                description: string;
            }>,
        ) {
            const { slideId, textId, description } = action.payload;
            return state.map(slide =>
                slide.id === slideId
                    ? {
                        ...slide,
                        content: slide.content.map(obj =>
                            obj.id === textId && obj.type === "text"
                                ? { ...obj, description }
                                : obj
                        ),
                    }
                    : slide
            );
        },

        set(_, action: PayloadAction<Editor>) {
            return action.payload.slides;
        },
    },
});

export const {
    addSlide,
    removeSlides,
    moveSlide,
    addSlideObject,
    removeSlideObject,
    editObjectPositionCoordinates,
    editObjectPositionSize,
    editTextSize,
    setFontFamily,
    editTextColor,
    editTextDescription,
    setSlideBackground,
    set,
} = slidesReducer.actions;

export default slidesReducer.reducer;