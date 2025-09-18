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

    Presentation,
    Image,
    Text,
    Slide,
    SlideObject
} from "./requirementTypes";

const minimalPresentation: Presentation = {
    title: "",
    slides: [],
    currentSlide: null,
    author: "",
    createdAt: new Date(),
    editedAt: new Date(),
};

const minimalSlide: Slide = {
    id: "",
    content: [],
    background: {
        type: "color",
        color: ""
    },
};

const minimalText: Text = {
    id: "",
    type: "text",
    description: "",
    position: { x: 0, y: 0, width: 0, height: 0, transparency: 0 },
    font: {
        family: "",
        color: "",
        size: 0,
        weight: 0,
        textDecoration: "none",
        textAlign: "left" },
};

const minimalImage: Image = {
    id: "",
    type: "image",
    source: "",
    position: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        transparency: 0
    }
};

const maxPresentation: Presentation = {
    title: "Presentation",
    slides: [],
    currentSlide: "slideId1",
    author: "Dmitry",
    createdAt: new Date(),
    editedAt: new Date(),
};

const maxSlide1: Slide = {
    id: "slideId1",
    content: [],
    background: {
        type: "color",
        color: "green"
    },
};

const maxSlide2: Slide = {
    id: "slideId2",
    content: [],
    background: {
        type: "picture",
        source: "background.png",
        transparency: 0.5
    },
};

const maxText1: Text = {
    id: "textId1",
    type: "text",
    description: "Hello it's test",
    position: {
        x: 10,
        y: 20,
        width: 100,
        height: 30,
        transparency: 0
    },
    font: {
        family: "Arial",
        color: "gray",
        size: 14,
        weight: 400,
        textDecoration: "none",
        textAlign: "left"
    },
};

const maxText2: Text = {
    id: "textId2",
    type: "text",
    description: "Hello world",
    position: {
        x: 15,
        y: 25,
        width: 150,
        height: 50,
        transparency: 0
    },
    font: {
        family: "Comic Sans MS",
        color: "black",
        size: 16,
        weight: 700,
        textDecoration: "underline",
        textAlign: "center"
    },
};

const maxImage1: Image = {
    id: "imageId1",
    type: "image",
    source: "img1.png",
    position: {
        x: 0,
        y: 0,
        width: 200,
        height: 200,
        transparency: 0
    },
};

const maxImage2: Image = {
    id: "imageId2",
    type: "image",
    source: "img2.png",
    position: {
        x: 50,
        y: 50,
        width: 300,
        height: 300,
        transparency: 0.1
    },
};

maxSlide1.content.push(maxText1, maxImage1);
maxSlide2.content.push(maxText2, maxImage2);
maxPresentation.slides.push(maxSlide1, maxSlide2);

console.log("setPresentationTitle");
console.log(setPresentationTitle(minimalPresentation, "New Title"));
console.log(setPresentationTitle(maxPresentation, "Updated Title"));

console.log("addSlide");
console.log(addSlide(minimalPresentation, minimalSlide));
console.log(addSlide(maxPresentation, maxSlide1));

console.log("removeSlide");
console.log(removeSlide(minimalPresentation, "anyId"));
console.log(removeSlide(maxPresentation, "slideId1"));

console.log("moveSlide");
console.log(moveSlide(minimalPresentation, "anyId", 0));
console.log(moveSlide(maxPresentation, "slideId2", 0));

console.log("addSlideObject");
console.log(addSlideObject(minimalSlide, minimalText));
console.log(addSlideObject(maxSlide1, maxImage2));

console.log("removeSlideObject");
console.log(removeSlideObject(minimalSlide, "anyId"));
console.log(removeSlideObject(maxSlide1, "textId1"));

console.log("editObject");
console.log(editObject(minimalText, "Edited"));
console.log(editObject(maxImage1, "new_image.png"));

console.log("setObjectPositionCoordinates");
console.log(setObjectPositionCoordinates(minimalText, { x: 10, y: 20 }));
console.log(setObjectPositionCoordinates(maxImage1, { x: 100, y: 200 }));

console.log("setObjectPositionSize");
console.log(setObjectPositionSize(minimalImage, { width: 50, height: 50 }));
console.log(setObjectPositionSize(maxImage2, { width: 500, height: 500 }));

console.log("setTextSize");
console.log(setTextSize(minimalSlide, "", 12));
console.log(setTextSize(maxSlide1, "textId1", 20));

console.log("setTextFont");
console.log(setTextFont(minimalSlide, "", "Times"));
console.log(setTextFont(maxSlide1, "textId1", "Courier"));

console.log("setTextDescription");
console.log(setTextDescription(minimalSlide, "", "Description"));
console.log(setTextDescription(maxSlide1, "textId1", "New Description"));

console.log("setSlideBackground");
console.log(setSlideBackground(minimalSlide, { type: "color", color: "white" }));
console.log(setSlideBackground(maxSlide1, { type: "picture", source: "bg2.png", transparency: 0.8 }));
