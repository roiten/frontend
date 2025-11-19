import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Slide, SlideObject, Background, Text, Editor } from "../types";

const initialState: Slide[] = [];

const slidesReducer = createSlice({
    name: 'slides',
    initialState,
    reducers: {
        addSlide(state, action: PayloadAction<Slide>) {
            state.push(action.payload);
        },

        removeSlides(state, action: PayloadAction<string[]>) {
            const idsToRemove = new Set(action.payload);
            return state.filter(s => !idsToRemove.has(s.id));
        },

        moveSlide(state, action: PayloadAction<{ slideIds: string[], newIndex: number }>) {
            const { slideIds, newIndex } = action.payload;
            const dragged: Slide[] = [];
            const toRemove: number[] = [];

            for (const id of slideIds) {
                const i = state.findIndex(s => s.id === id);
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

        addSlideObject(state, action: PayloadAction<{ slideId: string; obj: SlideObject }>) {
            const { slideId, obj } = action.payload;
            const slide = state.find(s => s.id === slideId);
            if (slide) slide.content.push(obj);
        },

        removeSlideObject(state, action: PayloadAction<{ slideId: string; objectId: string }>) {
            const { slideId, objectId } = action.payload;
            const slide = state.find(s => s.id === slideId);
            if (slide) slide.content = slide.content.filter(o => o.id !== objectId);
        },

        setObjectPositionCoordinates(
            state,
            action: PayloadAction<{ slideId: string; slideObject: SlideObject; position: { x: number; y: number } }>,
        ) {
            const { slideId, slideObject, position } = action.payload;
            const slide = state.find(s => s.id === slideId);
            if (slide) {
                const obj = slide.content.find(o => o.id === slideObject.id);
                if (obj) {
                    obj.position.x = position.x;
                    obj.position.y = position.y;
                }
            }
        },

        setObjectPositionSize(
            state,
            action: PayloadAction<{
                slideId: string;
                slideObject: SlideObject;
                position: { x: number; y: number };
                size: { width: number; height: number };
            }>,
        ) {
            const { slideId, slideObject, position, size } = action.payload;
            const slide = state.find(s => s.id === slideId);
            if (slide) {
                const obj = slide.content.find(o => o.id === slideObject.id);
                if (obj) {
                    obj.position.x = position.x;
                    obj.position.y = position.y;
                    obj.size.width = size.width;
                    obj.size.height = size.height;
                }
            }
        },

        setTextSize(state, action: PayloadAction<{ slideId: string; textId: string; size: number }>) {
            const { slideId, textId, size } = action.payload;
            const slide = state.find(s => s.id === slideId);
            if (slide) {
                const text = slide.content.find((o): o is Text => o.type === 'text' && o.id === textId);
                if (text) text.font.size = size;
            }
        },

        setFontFamily(state, action: PayloadAction<{ slideId: string; textId: string; family: string }>) {
            const { slideId, textId, family } = action.payload;
            const slide = state.find(s => s.id === slideId);
            if (slide) {
                const text = slide.content.find((o): o is Text => o.type === 'text' && o.id === textId);
                if (text) text.font.family = family;
            }
        },

        setTextColor(state, action: PayloadAction<{ slideId: string; textId: string; color: string }>) {
            const { slideId, textId, color } = action.payload;
            const slide = state.find(s => s.id === slideId);
            if (slide) {
                const text = slide.content.find((o): o is Text => o.type === 'text' && o.id === textId);
                if (text) text.font.color = color;
            }
        },

        setTextDescription(state, action: PayloadAction<{ slideId: string; textId: string; description: string }>) {
            const { slideId, textId, description } = action.payload;
            const slide = state.find(s => s.id === slideId);
            if (slide) {
                const text = slide.content.find((o): o is Text => o.type === 'text' && o.id === textId);
                if (text) text.description = description;
            }
        },

        setSlideBackground(state, action: PayloadAction<{ slideId: string; background: Background }>) {
            const { slideId, background } = action.payload;
            const slide = state.find(s => s.id === slideId);
            if (slide) slide.background = background;
        },

        openPresentation(_, action: PayloadAction<Editor>) {
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
    setObjectPositionCoordinates,
    setObjectPositionSize,
    setTextSize,
    setFontFamily,
    setTextColor,
    setTextDescription,
    setSlideBackground,
    openPresentation,
} = slidesReducer.actions;

export default slidesReducer.reducer;