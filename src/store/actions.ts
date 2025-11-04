import type { Editor, Slide, SlideObject, Background, Text } from "./types";

// Изменение названия презентации
function setPresentationTitle(pres: Editor, newTitle: string): Editor {
    return { ...pres, title: newTitle, editedAt: new Date() };
}

// добавление слайда
function createSlide(pres: Editor, slide: Slide): Editor {
    const newSlides = [...pres.slides, slide];
    return { ...pres, slides: newSlides, editedAt: new Date() };
}

function addSlide(pres: Editor, slide: Slide): Editor {
    const currentSlide = pres.currentSlide;
    if (currentSlide) {
        const currentIndex = pres.slides.findIndex((s) => s.id === currentSlide);
        if (currentIndex === -1) return pres;
        const newSlides = [...pres.slides];
        newSlides.splice(currentIndex + 1, 0, slide);
        return { ...pres, slides: newSlides, editedAt: new Date() };
    } else {
        return { ...pres, slides: [...pres.slides, slide], editedAt: new Date() };
    }
}

// Удаление слайда
function removeSlide(pres: Editor, slideId: string): Editor {
    const otherSlides = pres.slides.filter((s) => s.id !== slideId);
    return { ...pres, slides: otherSlides, editedAt: new Date() };
}

// Изменение позиции слайда
function moveSlide(pres: Editor, slideId: string, newIndex: number): Editor {
    const slides = [...pres.slides];
    const oldIndex = slides.findIndex((s) => s.id === slideId);
    if (oldIndex === -1) return pres;

    const [slide] = slides.splice(oldIndex, 1);
    slides.splice(newIndex, 0, slide);
    return { ...pres, slides, editedAt: new Date() };
}

// Добавление объекта в слайд
function addSlideObjectToSlide(slide: Slide, obj: SlideObject): Slide {
    return { ...slide, content: [...slide.content, obj] };
}

// Добавление объекта в слайд (возвращает презентацию)
function addSlideObject(
    pres: Editor,
    slideId: string,
    obj: SlideObject,
): Editor {
    let necessarySlide = pres.slides.find((s) => s.id === slideId);
    if (!necessarySlide) {
        return pres;
    }
    necessarySlide = addSlideObjectToSlide(necessarySlide, obj);
    const slides = pres.slides.map((slide) => {
        if (slide.id === slideId) return necessarySlide;
        return slide;
    });
    return { ...pres, slides, editedAt: new Date() };
}

function removeSlideObjectToSlide(slide: Slide, objectId: string): Slide {
    return {
        ...slide,
        content: slide.content.filter((obj) => obj.id !== objectId),
    };
}

// Удаление объекта
function removeSlideObject(
    pres: Editor,
    slideId: string,
    objectId: string,
): Editor {
    let necessarySlide = pres.slides.find((s) => s.id === slideId);
    if (!necessarySlide) {
        return pres;
    }
    necessarySlide = removeSlideObjectToSlide(necessarySlide, objectId);
    const slides = pres.slides.map((slide) => {
        if (slide.id === slideId) return necessarySlide;
        return slide;
    });
    return { ...pres, slides, editedAt: new Date() };
}

// Изменение текста или картинки
function editObject(obj: SlideObject, src: string): SlideObject {
    if (obj.type === "text") {
        return { ...obj, description: src };
    } else if (obj.type === "image") {
        return { ...obj, source: src };
    }
    return obj;
}

// изменение позиции объекта
function setObjectPositionCoordinates(
    pres: Editor,
    slideId: string,
    slideObject: SlideObject,
    position: { x: number; y: number },
): Editor {
    const slide = pres.slides.find((s) => s.id === slideId);
    if (!slide) return pres;

    const newObject = {
        ...slideObject,
        position: { ...slideObject.position, ...position },
    };

    const newContent = slide.content.map(obj =>
        obj.id === slideObject.id ? newObject : obj
    );

    const newSlide = { ...slide, content: newContent };
    const newSlides = pres.slides.map(s =>
        s.id === slideId ? newSlide : s
    );
    return { ...pres, slides: newSlides, editedAt: new Date() };
}

function setObjectPositionSize(
    pres: Editor,
    slideId: string,
    slideObject: SlideObject,
    position: { x: number; y: number },
    size: { width: number; height: number }
): Editor {
    const slide = pres.slides.find((s) => s.id === slideId);
    if (!slide) return pres;

    const newObject = {
        ...slideObject,
        size: { ...slideObject.size, ...size },
        position: { ...slideObject.position, ...position },
    };

    const newContent = slide.content.map(obj =>
        obj.id === slideObject.id ? newObject : obj
    );

    const newSlide = { ...slide, content: newContent };
    const newSlides = pres.slides.map(s =>
        s.id === slideId ? newSlide : s
    );

    return { ...pres, slides: newSlides, editedAt: new Date() };
}


// Изменение размера шрифта для текста
function setTextSizeToSlide(slide: Slide, textId: string, size: number): Slide {
    const content = slide.content.map((obj) =>
        obj.type === "text" && obj.id === textId
            ? { ...obj, font: { ...obj.font, size } }
            : obj,
    );
    return { ...slide, content };
}

//  Изменение размера шрифта для текста (возвращает презентацию)
function setTextSize(
    pres: Editor,
    slideId: string,
    textId: string,
    size: number,
): Editor {
    let necessarySlide = pres.slides.find((s) => s.id === slideId);
    if (!necessarySlide) {
        return pres;
    }
    necessarySlide = setTextSizeToSlide(necessarySlide, textId, size);
    const slides = pres.slides.map((slide) => {
        if (slide.id === slideId) return necessarySlide;
        return slide;
    });
    return { ...pres, slides, editedAt: new Date() };
}

// Изменение семейства шрифта для текста
function setTextFontToSlide(
    slide: Slide,
    textId: string,
    family: string,
): Slide {
    const content = slide.content.map((obj) =>
        obj.type === "text" && obj.id === textId
            ? { ...obj, font: { ...obj.font, family } }
            : obj,
    );
    return { ...slide, content };
}

function setFontFamily(
    pres: Editor,
    slideId: string,
    textId: string,
    family: string,
): Editor {
    let necessarySlide = pres.slides.find((s) => s.id === slideId);
    if (!necessarySlide) {
        return pres;
    }
    necessarySlide = setTextFontToSlide(necessarySlide, textId, family);
    const slides = pres.slides.map((slide) => {
        if (slide.id === slideId) return necessarySlide;
        return slide;
    });
    return { ...pres, slides, editedAt: new Date() };
}

function setTextColorToSlide(
    slide: Slide,
    textId: string,
    color: string,
): Slide {
    const content = slide.content.map((obj) =>
        obj.type === "text" && obj.id === textId
            ? { ...obj, font: { ...obj.font, color } }
            : obj,
    );
    return { ...slide, content };
}

function setTextColor(
    pres: Editor,
    slideId: string,
    textId: string,
    color: string,
): Editor {
    let necessarySlide = pres.slides.find((s) => s.id === slideId);
    if (!necessarySlide) {
        return pres;
    }
    necessarySlide = setTextColorToSlide(necessarySlide, textId, color);
    const slides = pres.slides.map((slide) => {
        if (slide.id === slideId) return necessarySlide;
        return slide;
    });
    return { ...pres, slides, editedAt: new Date() };
}

// изменение текста
function setTextDescription(
    pres: Editor,
    payload: { slideId: string; textId: string; description: string },
): Editor {
    const { slideId, textId, description } = payload;

    const slides = pres.slides.map((slide) => {
        if (slide.id !== slideId) return slide;
        const content = slide.content.map((obj) =>
            obj.type === "text" && obj.id === textId
                ? { ...obj, description }
                : obj,
        );
        return { ...slide, content };
    });

    return { ...pres, slides, editedAt: new Date() };
}

function setSlideBackground(
    pres: Editor,
    slideId: string,
    background: Background,
): Editor {
    const updatedSlides = pres.slides.map((slide) =>
        slide.id === slideId ? { ...slide, background: background } : slide,
    );
    return { ...pres, slides: updatedSlides };
}

function getTextObjectById(pres: Editor, objectId: string): Text | null {
    const currentSlide = pres.currentSlide;
    if (!currentSlide) return null;

    const current = pres.slides.find((slide) => slide.id === currentSlide);
    if (!current) return null;

    const foundObject = current.content.find((obj) => obj.id === objectId);
    if (!foundObject || foundObject.type != "text") return null;
    return foundObject;
}

function chooseSlide(pres: Editor, slideId: string): Editor {
    const slideExists = pres.slides.some((slide) => slide.id === slideId);
    if (slideExists) {
        return { ...pres, currentSlide: slideId };
    }
    return pres;
}

// Установить выбранные объекты
function setSelectedObjects(pres: Editor, objectIds: string[] | null): Editor {
    return { ...pres, selectedObjects: objectIds, editedAt: new Date() };
}

// Добавить объект в выделение
function addSelectedObject(pres: Editor, objectId: string): Editor {
    const current = pres.selectedObjects || [];
    if (current.includes(objectId)) {
        return pres;
    }
    return {
        ...pres,
        selectedObjects: [...current, objectId],
        editedAt: new Date(),
    };
}

// Убрать объект из выделения
function removeSelectedObject(pres: Editor, objectId: string): Editor {
    const current = pres.selectedObjects;
    if (!current) return pres;
    const newSelection = current.filter((id) => id !== objectId);
    return {
        ...pres,
        selectedObjects: newSelection.length > 0 ? newSelection : null,
        editedAt: new Date(),
    };
}

// Очистить выделение
function clearSelectedObjects(pres: Editor): Editor {
    return { ...pres, selectedObjects: null, editedAt: new Date() };
}

export {
    setPresentationTitle,
    addSlide,
    createSlide,
    removeSlide,
    moveSlide,
    addSlideObject,
    removeSlideObject,
    editObject,
    setObjectPositionCoordinates,
    setObjectPositionSize,
    setTextSize,
    setFontFamily,
    setTextColor,
    setTextDescription,
    setSlideBackground,
    chooseSlide,
    addSlideObjectToSlide,
    setSelectedObjects,
    addSelectedObject,
    removeSelectedObject,
    clearSelectedObjects,
    getTextObjectById,
};
