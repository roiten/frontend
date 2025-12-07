type Undoable<T> = {
    past: T[];
    present: T;
    future: T[];
};

type Editor = Undoable<{
    meta: MetaData;
    slides: Slide[];
    selection: Selection;
}>;

type Selection = {
    currentSlide: string | null;
    selectedObjects: string[] | null;
};

type MetaData = {
    title: string;
    author: string;
    createdAt: number;
    editedAt: number;
}

type Slide = {
    id: string;
    background: Background;
    content: SlideObject[];
};

type Background = Color | Picture;
type Color = { type: "color"; color: string };
type Picture = { type: "picture"; source: string; transparency: number };

type SlideObject = Text | Image;

type Text = {
    id: string;
    transparency: number;
    position: { x: number; y: number };
    size: { width: number; height: number };
    description: string;
    type: "text";
    font: {
        family: string;
        color: string;
        size: number;
        weight: number;
        textDecoration: "strikethrough" | "underline" | "none";
        textAlign: "left" | "center" | "right" | "justify";
    };
};

type Image = {
    id: string;
    transparency: number;
    position: { x: number; y: number };
    size: { width: number; height: number };
    source: string;
    type: "image";
};

type ModalType = "background-color" | "image-url" | null;

export type {
    Undoable,
    Editor,
    Image,
    Text,
    Slide,
    SlideObject,
    Background,
    ModalType,
    Selection,
    MetaData,
};