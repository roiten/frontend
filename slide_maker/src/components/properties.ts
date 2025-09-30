import type { Presentation, Text, Image, Background } from './types';
export const TEXT_PRESETS = {
    type: 'text',
    position: { x: 50, y: 50 },
    size: { width: 200, height: 350 },
    transparency: 1,
    font: {
        family: 'Arial',
        color: 'black',
        size: 14,
        weight: 400,
        textDecoration: 'none',
        textAlign: 'left',
    },
} as const;

export const DEFAULT_PRESENTATION: Presentation = {
    title: 'New presentation',
    slides: [],
    currentSlide: null,
    author: 'unknown',
    createdAt: new Date(),
    editedAt: new Date(),
} as const;

export const IMAGE_PRESETS = {
    type: 'image',
    position: { x: 50, y: 50 },
    size: { width: 200, height: 350 },
    transparency: 1,
} as const;

export const DEFAULT_BACKGROUND: types.Background = {
    type: 'color',
    color: 'white',
} as const;
