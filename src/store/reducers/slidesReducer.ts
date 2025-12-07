import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Slide, SlideObject, Background } from "../types";

const initialState: Slide[] = [];

const slidesReducer = createSlice({
    name: "slides",
    initialState,
    reducers: {
        addSlide(state, action: PayloadAction<Slide>) {
            return [...state, action.payload];
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
                ...dragged.map((s) => ({ ...s, content: [...s.content] })),
                ...remaining.slice(newIndex),
            ];
        },

        addSlideObject(
            state,
            action: PayloadAction<{ slideId: string; obj: SlideObject }>
        ) {
            return state.map((slide) =>
                slide.id === action.payload.slideId
                    ? { ...slide, content: [...slide.content, action.payload.obj] }
                    : slide
            );
        },

        removeSlideObject(
            state,
            action: PayloadAction<{ slideId: string; objectId: string }>
        ) {
            return state.map((slide) =>
                slide.id === action.payload.slideId
                    ? {
                          ...slide,
                          content: slide.content.filter(
                              (obj) => obj.id !== action.payload.objectId
                          ),
                      }
                    : slide
            );
        },

        editSlideBackground(
            state,
            action: PayloadAction<{ slideId: string; background: Background }>
        ) {
            return state.map((slide) =>
                slide.id === action.payload.slideId
                    ? { ...slide, background: { ...action.payload.background } }
                    : slide
            );
        },

        editObjectPositionCoordinates(
            state,
            action: PayloadAction<{
                slideId: string;
                slideObject: SlideObject;
                position: { x: number; y: number };
            }>
        ) {
            return state.map((slide) =>
                slide.id === action.payload.slideId
                    ? {
                          ...slide,
                          content: slide.content.map((obj) =>
                              obj.id === action.payload.slideObject.id
                                  ? { ...obj, position: { ...action.payload.position } }
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
            }>
        ) {
            return state.map((slide) =>
                slide.id === action.payload.slideId
                    ? {
                          ...slide,
                          content: slide.content.map((obj) =>
                              obj.id === action.payload.slideObject.id
                                  ? {
                                        ...obj,
                                        position: { ...action.payload.position },
                                        size: { ...action.payload.size },
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
            }>
        ) {
            return state.map((slide) =>
                slide.id === action.payload.slideId
                    ? {
                          ...slide,
                          content: slide.content.map((obj) =>
                              obj.id === action.payload.textId && obj.type === "text"
                                  ? { ...obj, font: { ...obj.font, size: action.payload.size } }
                                  : obj
                          ),
                      }
                    : slide
            );
        },

        editFontFamily(
            state,
            action: PayloadAction<{
                slideId: string;
                textId: string;
                family: string;
            }>
        ) {
            return state.map((slide) =>
                slide.id === action.payload.slideId
                    ? {
                          ...slide,
                          content: slide.content.map((obj) =>
                              obj.id === action.payload.textId && obj.type === "text"
                                  ? { ...obj, font: { ...obj.font, family: action.payload.family } }
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
            }>
        ) {
            return state.map((slide) =>
                slide.id === action.payload.slideId
                    ? {
                          ...slide,
                          content: slide.content.map((obj) =>
                              obj.id === action.payload.textId && obj.type === "text"
                                  ? { ...obj, font: { ...obj.font, color: action.payload.color } }
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
            }>
        ) {
            return state.map((slide) =>
                slide.id === action.payload.slideId
                    ? {
                          ...slide,
                          content: slide.content.map((obj) =>
                              obj.id === action.payload.textId && obj.type === "text"
                                  ? { ...obj, description: action.payload.description }
                                  : obj
                          ),
                      }
                    : slide
            );
        },

        set(_, action: PayloadAction<Slide[]>) {
            return action.payload.map((slide) => ({
                ...slide,
                content: slide.content.map((obj) => ({ ...obj })),
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
