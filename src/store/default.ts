import type { Editor, Background } from "./types.ts";


export const TEXT_PRESETS = {
    type: "text",
    description: "",
    transparency: 1,
    position: { x: 50, y: 50 },
    size: { width: 200, height: 50 },
    font: {
        family: "Roboto",
        color: "#000000",
        size: 18,
        weight: 400,
        textDecoration: "none",
        textAlign: "left",
    },
} as const;

export const createDefaultPresentation = (): Editor => ({
    past: [],
    future: [],
    present: {
        meta: {
            title: "New presentation",
            author: "unknown",
            presentationId: "",
            createdAt: Date.now(),
            editedAt: Date.now(),
        },
        slides: [],
        selection: {
            currentSlide: null,
            selectedObjects: null,
        },
    },
});

export const IMAGE_PRESETS = {
    type: "image",
    position: { x: 50, y: 50 },
    size: { width: 200, height: 350 },
    transparency: 1,
} as const;

export const DEFAULT_BACKGROUND: Background = {
    type: "color",
    color: "white",
} as const;

export const PREVIEW_WIDTH = 200;
export const SLIDE_WIDTH = 1200;
export const SLIDE_HEIGHT = 800;
export const IMAGE_MIN_SIZE = 10;
