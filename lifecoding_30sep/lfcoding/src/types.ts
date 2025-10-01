// Презентация
type Presentation = {
    title: string;
    slides: Array<Slide>;
};

type Editor = {
    presentation: Presentation;
    selection: Selection;
}

// Слайд
type Slide = {
    id: string;
    objects: Array<SlideObject>;
};

// Объект слайда
type SlideObject = TextObject | ImageObject;

// базовый объект слайда
type BaseSlideObject = {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
};

// текст
type TextObject = BaseSlideObject & {
    test: string;
    type: 'text';
    fontFamily: string;
    fontSize: number;
    bold: boolean;
    italic: boolean;
    underline: boolean;
};

// изображение
type ImageObject = BaseSlideObject & {
    src: string;
    type: 'image';
};

// выделение
type Selection = {
    selectedSlideId: string;
    selectedObjectId: string[];
};

export type { ImageObject, Selection, BaseSlideObject, TextObject, Slide, SlideObject, Presentation, Editor };


function moveSlides(editor, targetSlideIndex): Editor {
    const slides: Array<Slide> = [];
    const movableSlide: Slide = editor.presentation.slides.find(slide => slide.id === editor.selection.selectedSlideId);
    if (!movableSlide) {
        return editor;
    }

    const newSlides: Array<Slide> = [
        ...slides.slice(0, targetSlideIndex).filter(slide => slide.id !== targetSlideIndex),
        movableSlide,
        ...slides.slice(0, targetSlideIndex + 1).filter(slide => slide.id !== targetSlideIndex),
    ];

    return {
        ...editor,
        presentation: {
            ...editor.presentation,
            slides: newSlides,
        }
    }
};


function removeSlide(editor: Editor, selectedSlideObject: string[]): Editor {
    return {
        ...editor,
        slides: presentation.slides.filter(slide => slide.id )
    }
}

//