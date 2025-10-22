import {
    addSlide,
    setSlideBackground,
    addSlideObjectToSlide,
} from "../store/actions.ts";

import type { Editor, Image, Text, Slide } from "../store/types.ts";

export function maxTest(): Editor {
    let maxPresentation: Editor = {
        title: "Presentation",
        slides: [],
        currentSlide: "slide2",
        selectedObjects: null,
        author: "Dmitry",
        createdAt: new Date(),
        editedAt: new Date(),
    };

    let maxSlide1: Slide = {
        id: "slide1",
        content: [],
        background: { type: "color", color: "#a0a0a0" },
    };

    let maxSlide2: Slide = {
        id: "slide2",
        content: [],
        background: {
            type: "picture",
            source: "background.png",
            transparency: 0.5,
        },
    };

    let maxSlide3: Slide = {
        id: "slide3",
        content: [],
        background: { type: "color", color: "red" },
    };

    let maxSlide4: Slide = {
        id: "slide4",
        content: [],
        background: { type: "color", color: "green" },
    };

    let maxSlide5: Slide = {
        id: "slide5",
        content: [],
        background: { type: "color", color: "blue" },
    };

    const maxText1: Text = {
        id: "text1",
        type: "text",
        description: "hello! text test",
        position: { x: 10, y: 60 },
        size: { width: 400, height: 30 },
        transparency: 0,
        font: {
            family: "Arial",
            color: "white",
            size: 38,
            weight: 400,
            textDecoration: "none",
            textAlign: "left",
        },
    };

    const maxText2: Text = {
        id: "text2",
        type: "text",
        description: "Hello world!",
        position: { x: 15, y: 550 },
        size: { width: 600, height: 50 },
        transparency: 0,
        font: {
            family: "Comic Sans MS",
            color: "black",
            size: 46,
            weight: 700,
            textDecoration: "underline",
            textAlign: "center",
        },
    };

    const maxImage1: Image = {
        id: "image1",
        type: "image",
        source: "https://avatars.mds.yandex.net/i?id=8eeb4769444ae6fbcba59763dd9eca47_l-10836825-images-thumbs&n=13",
        transparency: 1,
        position: { x: 0, y: 0 },
        size: { width: 1200, height: 500 },
    };

    const maxImage2: Image = {
        id: "image2",
        type: "image",
        source: "https://habrastorage.org/webt/fr/d5/en/frd5enzjfyfdksaoaema1gvnpva.png",
        transparency: 0.5,
        position: { x: 50, y: 50 },
        size: { width: 530, height: 300 },
    };

    const maxImage3: Image = {
        id: "image3",
        type: "image",
        source: "/public/sun.png",
        transparency: 1,
        position: { x: 150, y: 100 },
        size: { width: 800, height: 600 },
    };

    maxSlide1 = addSlideObjectToSlide(maxSlide1, maxImage2);
    maxSlide1 = addSlideObjectToSlide(maxSlide1, maxText1);

    maxSlide2 = addSlideObjectToSlide(maxSlide2, maxText2);
    maxSlide2 = addSlideObjectToSlide(maxSlide2, maxImage1);
    maxSlide3 = addSlideObjectToSlide(maxSlide3, maxImage3);

    maxPresentation = addSlide(maxPresentation, maxSlide1);
    maxPresentation = addSlide(maxPresentation, maxSlide2);
    maxPresentation = addSlide(maxPresentation, maxSlide3);
    maxPresentation = addSlide(maxPresentation, maxSlide4);
    maxPresentation = addSlide(maxPresentation, maxSlide5);

    maxPresentation = setSlideBackground(maxPresentation, "slide1", {
        type: "picture",
        source: "https://wallpapers.com/images/hd/4k-fall-hjtjbjpx534rzbsd.jpg",
        transparency: 1,
    });

    return maxPresentation;
}
