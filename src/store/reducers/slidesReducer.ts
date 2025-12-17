import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Slide, SlideObject, Background, Text, Image } from "../types";

const initialState: Slide[] = [];

const slidesReducer = createSlice({
    name: "slides",
    initialState,
    reducers: {
        addSlide(state, action: PayloadAction<Slide>) {
            return [
                ...state,
                {
                    ...action.payload,
                    content: action.payload.content.map(obj => ({ ...obj })),
                    background: { ...action.payload.background }
                }
            ];
        },

        removeSlides(state, action: PayloadAction<string[]>) {
            const idsToRemove = new Set(action.payload);
            return state.filter((s) => !idsToRemove.has(s.id));
        },

        moveSlide(
            state,
            action: PayloadAction<{ slideIds: string[]; newIndex: number }>
        ) {
            const { slideIds, newIndex } = action.payload;
            const dragged = state.filter((s) => slideIds.includes(s.id));
            const remaining = state.filter((s) => !slideIds.includes(s.id));

            return [
                ...remaining.slice(0, newIndex),
                ...dragged.map((s) => ({ 
                    ...s, 
                    content: s.content.map(obj => ({ ...obj })),
                    background: { ...s.background }
                })),
                ...remaining.slice(newIndex),
            ];
        },

        addSlideObject(
            state,
            action: PayloadAction<{ slideId: string; obj: SlideObject }>
        ) {
            return state.map((slide) => {
                if (slide.id !== action.payload.slideId) {
                    return slide;
                }
                return { 
                    ...slide, 
                    content: [...slide.content, { ...action.payload.obj }],
                    background: { ...slide.background }
                };
            });
        },

        removeSlideObject(
            state,
            action: PayloadAction<{ slideId: string; objectId: string }>
        ) {
            return state.map((slide) => {
                if (slide.id !== action.payload.slideId) {
                    return slide;
                }
                return {
                    ...slide,
                    content: slide.content.filter(
                        (obj) => obj.id !== action.payload.objectId
                    ).map(obj => ({ ...obj })),
                    background: { ...slide.background }
                };
            });
        },

        editSlideBackground(
            state,
            action: PayloadAction<{ slideId: string; background: Background }>
        ) {
            return state.map((slide) => {
                if (slide.id !== action.payload.slideId) {
                    return slide;
                }
                return { 
                    ...slide, 
                    background: { ...action.payload.background },
                    content: slide.content.map(obj => ({ ...obj }))
                };
            });
        },

        editObjectPositionCoordinates(
            state,
            action: PayloadAction<{
                slideId: string;
                slideObject: SlideObject;
                position: { x: number; y: number };
            }>
        ) {
            return state.map((slide) => {
                if (slide.id !== action.payload.slideId) {
                    return slide;
                }
                return {
                    ...slide,
                    content: slide.content.map((obj) => {
                        if (obj.id !== action.payload.slideObject.id) {
                            return { ...obj };
                        }
                        return { 
                            ...obj, 
                            position: { ...action.payload.position } 
                        };
                    }),
                    background: { ...slide.background }
                };
            });
        },

        editObjectPositionSize(
            state,
            action: PayloadAction<{
                slideId: string;
                slideObject: SlideObject;
                position: { x: number; y: number };
                size: { width: number; height: number };
            }>
        ) {
            return state.map((slide) => {
                if (slide.id !== action.payload.slideId) {
                    return slide;
                }
                return {
                    ...slide,
                    content: slide.content.map((obj) => {
                        if (obj.id !== action.payload.slideObject.id) {
                            return { ...obj };
                        }
                        return { 
                            ...obj, 
                            position: { ...action.payload.position },
                            size: { ...action.payload.size }
                        };
                    }),
                    background: { ...slide.background }
                };
            });
        },

        editTextSize(
            state,
            action: PayloadAction<{
                slideId: string;
                textId: string;
                size: number;
            }>
        ) {
            return state.map((slide) => {
                if (slide.id !== action.payload.slideId) {
                    return slide;
                }
                return {
                    ...slide,
                    content: slide.content.map((obj) => {
                        if (obj.id !== action.payload.textId || obj.type !== "text") {
                            return { ...obj };
                        }
                        const textObj = obj as Text;
                        return { 
                            ...textObj, 
                            font: { 
                                ...textObj.font, 
                                size: action.payload.size 
                            }
                        };
                    }),
                    background: { ...slide.background }
                };
            });
        },

        editFontFamily(
            state,
            action: PayloadAction<{
                slideId: string;
                textId: string;
                family: string;
            }>
        ) {
            return state.map((slide) => {
                if (slide.id !== action.payload.slideId) {
                    return slide;
                }
                return {
                    ...slide,
                    content: slide.content.map((obj) => {
                        if (obj.id !== action.payload.textId || obj.type !== "text") {
                            return { ...obj };
                        }
                        const textObj = obj as Text;
                        return { 
                            ...textObj, 
                            font: { 
                                ...textObj.font, 
                                family: action.payload.family 
                            }
                        };
                    }),
                    background: { ...slide.background }
                };
            });
        },

        editTextColor(
            state,
            action: PayloadAction<{
                slideId: string;
                textId: string;
                color: string;
            }>
        ) {
            return state.map((slide) => {
                if (slide.id !== action.payload.slideId) {
                    return slide;
                }
                return {
                    ...slide,
                    content: slide.content.map((obj) => {
                        if (obj.id !== action.payload.textId || obj.type !== "text") {
                            return { ...obj };
                        }
                        const textObj = obj as Text;
                        return { 
                            ...textObj, 
                            font: { 
                                ...textObj.font, 
                                color: action.payload.color 
                            }
                        };
                    }),
                    background: { ...slide.background }
                };
            });
        },

        editTextDescription(
            state,
            action: PayloadAction<{
                slideId: string;
                textId: string;
                description: string;
            }>
        ) {
            return state.map((slide) => {
                if (slide.id !== action.payload.slideId) {
                    return slide;
                }
                return {
                    ...slide,
                    content: slide.content.map((obj) => {
                        if (obj.id !== action.payload.textId || obj.type !== "text") {
                            return { ...obj };
                        }
                        return { 
                            ...obj, 
                            description: action.payload.description 
                        };
                    }),
                    background: { ...slide.background }
                };
            });
        },

        set(_, action: PayloadAction<Slide[]>) {
            return action.payload.map((slide) => ({
                ...slide,
                content: slide.content.map((obj) => ({ ...obj })),
                background: { ...slide.background }
            }));
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
    editFontFamily,
    editTextColor,
    editTextDescription,
    editSlideBackground,
    set,
} = slidesReducer.actions;

export default slidesReducer.reducer;