import { Background } from "./requirementTypes";

export const TEXT_PRESETS = {
    position: { x: 50, y: 50, width: 200, height: 350, transparency: 1 },
    font: {
        family: 'Arial',
        color: 'black',
        size: 14,
        weight: 400,
        textDecoration: 'none',
        textAlign: 'left'
    }
};

export const IMAGE_PRESETS = {
    position: { x: 50, y: 50, width: 200, height: 350, transparency: 1 }
};


export const DEFAULT_BACKGROUND: Background = {
    type: 'color',
    color: 'white'
};
