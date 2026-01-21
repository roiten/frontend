import type { Editor, Background } from "./types.ts";
import { v4 as uuid } from "uuid";

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

export const createDefaultPresentation = (): Editor => {
    const newSlideId = uuid();
    
    return {
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
            slides: [
                {
                    id: newSlideId,
                    background: { type: "color", color: "white" },
                    content: [],
                    hidden: false,
                }
            ],
            selection: {
                currentSlide: newSlideId,
                selectedObjects: null,
            },
        },
    };
};

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
