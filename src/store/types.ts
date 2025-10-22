// Презентация
type Editor = {
    title: string;
    slides: Slide[];
    currentSlide: string | null;
    selectedObjects: string[] | null;
    author: string;
    createdAt: Date;
    editedAt: Date;
};

// Слайд
type Slide = {
    id: string;
    background: Background;
    content: SlideObject[];
};

// задний фон
type Background = Color | Picture;

type Color = {
    type: 'color';
    color: string;
};

type Picture = {
    type: 'picture';
    source: string;
    transparency: number;
};

// Объект слайда
type SlideObject = Text | Image;

// базовый объект слайда
type BaseObject = {
    id: string;
    transparency: number;

    position: {
        x: number;
        y: number;
    };

    size: {
        width: number;
        height: number;
    };
};

// текст
type Text = BaseObject & {
    description: string;
    type: 'text';
    font: {
        family: string;
        color: string;
        size: number;
        weight: number;
        textDecoration: 'strikethrough' | 'underline' | 'none';
        textAlign: 'left' | 'center' | 'right' | 'justify';
    };
};

// изображение
type Image = BaseObject & {
    source: string;
    type: 'image';
};

type ModalType = "background-color" | "image-url" | null;


// * изменение названия презентации ?
// * добавление/удаление слайда ?
// * изменение позиции слайда
// * добавление/удаление текста и картинки +
// * изменение позиции текста/картинки ?
// * изменение объекта (картинки) +
// * изменение текста +
// * изменение семейства шрифтов у текста +
// * изменение фона слайда +

// Изменение названия презентации
function setPresentationTitle(pres: Editor, newTitle: string): Editor {
    return { ...pres, title: newTitle, editedAt: new Date() };
}

// добавление слайда
function addSlide(pres: Editor, slide: Slide): Editor {
    const newSlides = [...pres.slides, slide];
    return { ...pres, slides: newSlides, editedAt: new Date() };
}

// Удаление слайда
function removeSlide(pres: Editor, slideId: string): Editor {
    const otherSlides = pres.slides.filter(s => s.id !== slideId);
    return { ...pres, slides: otherSlides, editedAt: new Date() };
}

// Изменение позиции слайда
function moveSlide(pres: Editor, slideId: string, newIndex: number): Editor {
    const slides = [...pres.slides];
    const oldIndex = slides.findIndex(s => s.id === slideId);
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
    obj: SlideObject
): Editor {
    let necessarySlide = pres.slides.find(s => s.id === slideId);
    if (!necessarySlide) {
        return pres;
    }
    necessarySlide = addSlideObjectToSlide(necessarySlide, obj);
    const slides = pres.slides.map(slide => {
        if (slide.id === slideId) return necessarySlide;
        return slide;
    });
    return { ...pres, slides, editedAt: new Date() };
}

// Удаление объекта
function removeSlideObject(slide: Slide, objectId: string): Slide {
    return {
        ...slide,
        content: slide.content.filter(obj => obj.id !== objectId),
    };
}

// Изменение текста или картинки
function editObject(obj: SlideObject, src: string): SlideObject {
    if (obj.type === 'text') {
        return { ...obj, description: src };
    } else if (obj.type === 'image') {
        return { ...obj, source: src };
    }
    return obj;
}

// изменение позиции объекта
function setObjectPositionCoordinates(
    slideObject: SlideObject,
    position: { x: number; y: number }
): SlideObject {
    return {
        ...slideObject,
        position: { ...slideObject.position, ...position },
    } as SlideObject;
}

// изменение размера объекта
function setObjectPositionSize(
    slideObject: SlideObject,
    size: { width: number; height: number }
): SlideObject {
    return {
        ...slideObject,
        size: { ...slideObject.size, width: size.width, height: size.height },
    } as SlideObject;
}

// Изменение размера шрифта для текста
function setTextSizeToSlide(slide: Slide, textId: string, size: number): Slide {
    const content = slide.content.map(obj =>
        obj.type === 'text' && obj.id === textId
            ? { ...obj, font: { ...obj.font, size } }
            : obj
    );
    return { ...slide, content };
}

//  Изменение размера шрифта для текста (возвращает презентацию)
function setTextSize(
    pres: Editor,
    slideId: string,
    textId: string,
    size: number
): Editor {
    let necessarySlide = pres.slides.find(s => s.id === slideId);
    if (!necessarySlide) {
        return pres;
    }
    necessarySlide = setTextSizeToSlide(necessarySlide, textId, size);
    const slides = pres.slides.map(slide => {
        if (slide.id === slideId) return necessarySlide;
        return slide;
    });
    return { ...pres, slides, editedAt: new Date() };
}

// Изменение семейства шрифта для текста
function setTextFontToSlide(
    slide: Slide,
    textId: string,
    family: string
): Slide {
    const content = slide.content.map(obj =>
        obj.type === 'text' && obj.id === textId
            ? { ...obj, font: { ...obj.font, family } }
            : obj
    );
    return { ...slide, content };
}

function setFontFamily(
    pres: Editor,
    slideId: string,
    textId: string,
    family: string
): Editor {
    let necessarySlide = pres.slides.find(s => s.id === slideId);
    if (!necessarySlide) {
        return pres;
    }
    necessarySlide = setTextFontToSlide(necessarySlide, textId, family);
    const slides = pres.slides.map(slide => {
        if (slide.id === slideId) return necessarySlide;
        return slide;
    });
    return { ...pres, slides, editedAt: new Date() };
}

function setTextColorToSlide(
    slide: Slide,
    textId: string,
    color: string
): Slide {
    const content = slide.content.map(obj =>
        obj.type === 'text' && obj.id === textId
            ? { ...obj, font: { ...obj.font, color } }
            : obj
    );
    return { ...slide, content };
}

function setTextColor(
    pres: Editor,
    slideId: string,
    textId: string,
    color: string
): Editor {
    let necessarySlide = pres.slides.find(s => s.id === slideId);
    if (!necessarySlide) {
        return pres;
    }
    necessarySlide = setTextColorToSlide(necessarySlide, textId, color);
    const slides = pres.slides.map(slide => {
        if (slide.id === slideId) return necessarySlide;
        return slide;
    });
    return { ...pres, slides, editedAt: new Date() };
}

// изменение текста
function setTextDescription(
    pres: Editor,
    payload: { slideId: string; textId: string; description: string }
): Editor {
    const { slideId, textId, description } = payload;

    const slides = pres.slides.map(slide => {
        if (slide.id !== slideId) return slide;
        const content = slide.content.map(obj =>
            obj.type === 'text' && obj.id === textId
                ? { ...obj, description }
                : obj
        );
        return { ...slide, content };
    });

    return { ...pres, slides, editedAt: new Date() };
}

// Изменение фона слайда
function setSlideBackground(slide: Slide, Background: Background): Slide {
    return { ...slide, background: Background };
}

function chooseSlide(pres: Editor, slideId: string): Editor {
    const slideExists = pres.slides.some(slide => slide.id === slideId);
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
    const newSelection = current.filter(id => id !== objectId);
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
};

export type { Editor, Image, Text, Slide, SlideObject, Background, ModalType };
