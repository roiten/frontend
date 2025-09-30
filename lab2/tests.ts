import {
    setPresentationTitle,
    addSlide,
    removeSlide,
    moveSlide,
    addSlideObject,
    removeSlideObject,
    editObject,
    setObjectPositionCoordinates,
    setObjectPositionSize,
    setTextSize,
    setTextFont,
    setTextDescription,
    setSlideBackground,
    chooseSlide,
    Presentation,
    Image,
    Text,
    Slide,
} from './types';
import { DEFAULT_BACKGROUND, DEFAULT_PRESENTATION, IMAGE_PRESETS, TEXT_PRESETS } from "./properties";

let minimalPresentation: Presentation = {
    title: '',
    slides: [],
    currentSlide: null,
    author: '',
    createdAt: new Date(),
    editedAt: new Date(),
};

let minimalSlide: Slide = {
    id: 'slide1',
    content: [],
    background: { type: 'color', color: '' },
};

const minimalText: Text = {
    id: 'text1',
    type: 'text',
    description: '',
    position: { x: 0, y: 0 },
    size: { width: 0, height: 0 },
    transparency: 0,
    font: {
        family: '',
        color: '',
        size: 0,
        weight: 0,
        textDecoration: 'none',
        textAlign: 'left',
    },
};

const minimalImage: Image = {
    id: 'image1',
    type: 'image',
    source: '',
    transparency: 0,
    position: { x: 0, y: 0 },
    size: { width: 0, height: 0 },
};

minimalSlide = addSlideObject(minimalSlide, minimalText);
minimalSlide = addSlideObject(minimalSlide, minimalImage);

minimalPresentation = addSlide(minimalPresentation, minimalSlide);
minimalPresentation = chooseSlide(minimalPresentation, 'slide1');

let normalPresentation: Presentation = {
    title: 'normal presentation',
    ...DEFAULT_PRESENTATION
}

let normalSlide: Slide = {
    id: 'slide1',
    content: [],
    background: DEFAULT_BACKGROUND,
}

let normalText: Text = {
    id: 'text1',
    description: 'i like tomatoes!',
    ...TEXT_PRESETS
}

let normalImage: Image = {

    id: 'image1',
    source: '/home/Pictures/pomodoro.png',
    // задуматься как поддягивать картинки из инета
    ...IMAGE_PRESETS
}

let maxPresentation: Presentation = {
    title: 'Presentation',
    slides: [],
    currentSlide: 'slide1',
    author: 'Dmitry',
    createdAt: new Date(),
    editedAt: new Date(),
};

let maxSlide1: Slide = {
    id: 'slide1',
    content: [],
    background: { type: 'color', color: 'green' },
};

let maxSlide2: Slide = {
    id: 'slide2',
    content: [],
    background: { type: 'picture', source: 'background.png', transparency: 0.5 },
};

const maxText1: Text = {
    id: 'text1',
    type: 'text',
    description: 'Hello it`s test',
    position: { x: 10, y: 20 },
    size: { width: 100, height: 30 },
    transparency: 0,
    font: { family: 'Times New Roman', color: 'gray', size: 14, weight: 400, textDecoration: 'none', textAlign: 'left' },
};

const maxText2: Text = {
    id: 'text2',
    type: 'text',
    description: 'Hello world',
    position: { x: 15, y: 25 },
    size: { width: 150, height: 50 },
    transparency: 0,
    font: { family: 'Comic Sans MS', color: 'black', size: 16, weight: 700, textDecoration: 'underline', textAlign: 'center' },
};

const maxImage1: Image = {
    id: 'image1',
    type: 'image',
    source: 'img1.png',
    transparency: 0,
    position: { x: 0, y: 0 },
    size: { width: 200, height: 200 },
};

const maxImage2: Image = {
    id: 'image2',
    type: 'image',
    source: 'img2.png',
    transparency: 0.1,
    position: { x: 50, y: 50 },
    size: { width: 300, height: 300 },
};

maxSlide1 = addSlideObject(maxSlide1, maxText1);
maxSlide1 = addSlideObject(maxSlide1, maxImage2);

maxSlide2 = addSlideObject(maxSlide2, maxText2);
maxSlide2 = addSlideObject(maxSlide2, maxImage1);

maxPresentation = addSlide(maxPresentation, maxSlide1);
maxPresentation = addSlide(maxPresentation, maxSlide2);

console.log('max presentation', maxPresentation);

normalSlide = addSlideObject(normalSlide, normalText);
normalSlide = addSlideObject(normalSlide, normalImage);
normalPresentation = addSlide(normalPresentation, normalSlide);
normalPresentation = chooseSlide(normalPresentation, 'slide1');

console.log('normal presentation', normalPresentation);

console.log('min presentation', minimalPresentation);

console.log('setPresentationTitle');
console.log(setPresentationTitle(minimalPresentation, 'Новый заголовок'));
console.log(setPresentationTitle(maxPresentation, 'Заголовок'));

console.log('addSlide');
console.log(addSlide(minimalPresentation, minimalSlide));
console.log(addSlide(maxPresentation, maxSlide1));

console.log('removeSlide');
console.log(removeSlide(minimalPresentation, 'slide1'));
console.log(removeSlide(maxPresentation, 'slide2'));

console.log('moveSlide');
console.log(moveSlide(minimalPresentation, 'slide1', 0));
console.log(moveSlide(maxPresentation, 'slide2', 0));

console.log('addSlideObject');
console.log(addSlideObject(minimalSlide, minimalText));
console.log(addSlideObject(maxSlide1, maxImage2));

console.log('removeSlideObject');
console.log(removeSlideObject(minimalSlide, 'text1'));
console.log(removeSlideObject(maxSlide1, 'image2'));

console.log('editObject');
console.log(editObject(minimalText, 'edited'));
console.log(editObject(maxImage1, 'new_image.png'));

console.log('setObjectPositionCoordinates');
console.log(setObjectPositionCoordinates(minimalText, { x: 10, y: 20 }));
console.log(setObjectPositionCoordinates(maxImage1, { x: 100, y: 200 }));

console.log('setObjectPositionSize');
console.log(setObjectPositionSize(minimalImage, { width: 50, height: 50 }));
console.log(setObjectPositionSize(maxImage2, { width: 500, height: 500 }));

console.log('setTextSize');
console.log(setTextSize(minimalSlide, 'text1', 12));
console.log(setTextSize(maxSlide1, 'text1', 36));

console.log('setTextFont');
console.log(setTextFont(minimalSlide, 'text1', 'Times'));
console.log(setTextFont(maxSlide1, 'text1', 'Courier'));

console.log('setTextDescription');
console.log(setTextDescription(minimalSlide, 'text1', 'Description'));
console.log(setTextDescription(maxSlide1, 'text1', 'New Description'));

console.log('setSlideBackground');
console.log(setSlideBackground(minimalSlide, { type: 'color', color: 'white' }));
console.log(setSlideBackground(maxSlide1, { type: 'picture', source: 'bg2.png', transparency: 0.8 }));
