type Editor = {
    title: string;
    slides: Slide[];
    currentSlide: string | null;
    selectedObjects: string[] | null;
    author: string;
    createdAt: Date;
    editedAt: Date;
};

type Slide = {
    id: string;
    background: Background;
    content: SlideObject[];
};

type Background = Color | Picture;

type Color = {
    type: "color";
    color: string;
};

type Picture = {
    type: "picture";
    source: string;
    transparency: number;
};

type SlideObject = Text | Image;

type Text = {
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

    position: {
        x: number;
        y: number;
    };

    size: {
        width: number;
        height: number;
    };
    source: string;
    type: "image";
};

type ModalType = "background-color" | "image-url" | null;

type EditorAction =
    | { type: "SET_PRESENTATION_TITLE"; payload: string }
    | { type: "ADD_SLIDE"; payload: Slide }
    | { type: "REMOVE_SLIDES"; payload: string[] }
    | {
          type: "MOVE_SLIDE";
          payload: { slideIds: string[]; newIndex: number };
      }
    | {
          type: "ADD_SLIDE_OBJECT";
          payload: { slideId: string; obj: SlideObject };
      }
    | {
          type: "REMOVE_SLIDE_OBJECT";
          payload: { slideId: string; objectId: string };
      }
    | {
          type: "SET_OBJECT_POSITION_COORDINATES";
          payload: {
              slideId: string;
              slideObject: SlideObject;
              position: { x: number; y: number };
          };
      }
    | {
          type: "SET_OBJECT_POSITION_SIZE";
          payload: {
              slideId: string;
              slideObject: SlideObject;
              position: { x: number; y: number };
              size: { width: number; height: number };
          };
      }
    | {
          type: "SET_TEXT_SIZE";
          payload: { slideId: string; textId: string; size: number };
      }
    | {
          type: "SET_FONT_FAMILY";
          payload: { slideId: string; textId: string; family: string };
      }
    | {
          type: "SET_TEXT_COLOR";
          payload: { slideId: string; textId: string; color: string };
      }
    | {
          type: "SET_TEXT_DESCRIPTION";
          payload: { slideId: string; textId: string; description: string };
      }
    | {
          type: "SET_SLIDE_BACKGROUND";
          payload: { slideId: string; background: Background };
      }
    | { type: "CHOOSE_SLIDE"; payload: string }
    | { type: "SET_SELECTED_OBJECTS"; payload: string[] | null }
    | { type: "ADD_SELECTED_OBJECT"; payload: string }
    | { type: "REMOVE_SELECTED_OBJECT"; payload: string }
    | { type: "CLEAR_SELECTED_OBJECTS" }
    | { type: "OPEN_PRESENTATION"; payload: Editor };

export type {
    Editor,
    Image,
    Text,
    Slide,
    SlideObject,
    Background,
    ModalType,
    EditorAction,
};
