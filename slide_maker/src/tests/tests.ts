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
} from '../models/types.ts';

import type { Presentation, Image, Text, Slide } from 'src/components/types.ts';

import {
    DEFAULT_BACKGROUND,
    DEFAULT_PRESENTATION,
    IMAGE_PRESETS,
    TEXT_PRESETS,
} from '../constants/properties.ts';

export function minimalTest(): Presentation {
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
    return minimalPresentation;
}

export function maxTest(): Presentation {
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
        background: { type: 'color', color: '#a0a0a0' },
    };

    let maxSlide2: Slide = {
        id: 'slide2',
        content: [],
        background: { type: 'picture', source: 'background.png', transparency: 0.5 },
    };

    let maxSlide3: Slide = {
        id: 'slide3',
        content: [],
        background: { type: 'color', color: 'green' },
    };

    let maxSlide4: Slide = {
        id: 'slide4',
        content: [],
        background: { type: 'color', color: 'green' },
    };

    let maxSlide5: Slide = {
        id: 'slide5',
        content: [],
        background: { type: 'color', color: 'green' },
    };

    const maxText1: Text = {
        id: 'text1',
        type: 'text',
        description: 'Hello it`s test',
        position: { x: 10, y: 20 },
        size: { width: 100, height: 30 },
        transparency: 0,
        font: {
            family: 'Arial',
            color: 'gray',
            size: 14,
            weight: 400,
            textDecoration: 'none',
            textAlign: 'left',
        },
    };

    const maxText2: Text = {
        id: 'text2',
        type: 'text',
        description: 'Hello world',
        position: { x: 15, y: 25 },
        size: { width: 150, height: 50 },
        transparency: 0,
        font: {
            family: 'Comic Sans MS',
            color: 'black',
            size: 16,
            weight: 700,
            textDecoration: 'underline',
            textAlign: 'center',
        },
    };

    const maxImage1: Image = {
        id: 'image1',
        type: 'image',
        source: 'https://i.ytimg.com/vi/RVwWaURYhFU/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGFggZSg-MA8=&rs=AOn4CLBuN6l4D_Hvfzrv4kDl1maseMeDYw',
        transparency: 1,
        position: { x: 0, y: 0 },
        size: { width: 1920, height: 500 },
    };

    const maxImage2: Image = {
        id: 'image2',
        type: 'image',
        source: 'https://habrastorage.org/webt/fr/d5/en/frd5enzjfyfdksaoaema1gvnpva.png',
        transparency: 0.5,
        position: { x: 50, y: 50 },
        size: { width: 300, height: 300 },
    };

    maxSlide1 = addSlideObject(maxSlide1, maxText1);
    maxSlide1 = addSlideObject(maxSlide1, maxImage2);

    maxSlide2 = addSlideObject(maxSlide2, maxText2);
    maxSlide2 = addSlideObject(maxSlide2, maxImage1);

    maxPresentation = addSlide(maxPresentation, maxSlide1);
    maxPresentation = addSlide(maxPresentation, maxSlide2);
    maxPresentation = addSlide(maxPresentation, maxSlide3);
    maxPresentation = addSlide(maxPresentation, maxSlide4);
    maxPresentation = addSlide(maxPresentation, maxSlide5);

    return maxPresentation;
}
// console.log('max presentation', maxPresentation);
//
// console.log(setPresentationTitle(maxPresentation, 'Заголовок'));
//
// console.log(addSlide(maxPresentation, maxSlide1));
//
// console.log(removeSlide(maxPresentation, 'slide2'));
//
// console.log(moveSlide(maxPresentation, 'slide2', 0));
//
// console.log(addSlideObject(maxSlide1, maxImage2));
//
// console.log(removeSlideObject(maxSlide1, 'image2'));
//
// console.log(editObject(maxImage1, 'new_image.png'));
//
// console.log(setObjectPositionCoordinates(maxImage1, { x: 100, y: 200 }));
//
// console.log(setObjectPositionSize(maxImage2, { width: 500, height: 500 }));
//
// console.log(setTextSize(maxSlide1, 'text1', 36));
//
// console.log(setTextFont(maxSlide1, 'text1', 'Courier'));
//
// console.log(setTextDescription(maxSlide1, 'text1', 'New Description'));
//
// console.log(setSlideBackground(maxSlide1, { type: 'picture', source: 'bg2.png', transparency: 0.8 }));
