import type {
    Editor,
    Slide,
    SlideObject,
    Background,
} from './types';
import * as types from './actionTypes';


const setPresentationTitle = (newTitle: string) => ({
    type: types.SET_PRESENTATION_TITLE,
    payload: newTitle,
});

const addSlide = (slide: Slide) => ({
    type: types.ADD_SLIDE,
    payload: slide,
});

const removeSlides = (slideIds: string[]) => ({
    type: types.REMOVE_SLIDES,
    payload: slideIds,
});

const moveSlide = (slideIds: string[], newIndex: number) => ({
    type: types.MOVE_SLIDE,
    payload: { slideIds, newIndex },
});

const addSlideObject = (slideId: string, obj: SlideObject) => ({
    type: types.ADD_SLIDE_OBJECT,
    payload: { slideId, obj },
});

const removeSlideObject = (slideId: string, objectId: string) => ({
    type: types.REMOVE_SLIDE_OBJECT,
    payload: { slideId, objectId },
});

const setObjectPositionCoordinates = (
    slideId: string,
    slideObject: SlideObject,
    position: { x: number; y: number }
) => ({
    type: types.SET_OBJECT_POSITION_COORDINATES,
    payload: { slideId, slideObject, position },
});

const setObjectPositionSize = (
    slideId: string,
    slideObject: SlideObject,
    position: { x: number; y: number },
    size: { width: number; height: number }
) => ({
    type: types.SET_OBJECT_POSITION_SIZE,
    payload: { slideId, slideObject, position, size },
});

const setTextSize = (slideId: string, textId: string, size: number) => ({
    type: types.SET_TEXT_SIZE,
    payload: { slideId, textId, size },
});

const setFontFamily = (slideId: string, textId: string, family: string) => ({
    type: types.SET_FONT_FAMILY,
    payload: { slideId, textId, family },
});

const setTextColor = (slideId: string, textId: string, color: string) => ({
    type: types.SET_TEXT_COLOR,
    payload: { slideId, textId, color },
});

const setTextDescription = (slideId: string, textId: string, description: string) => ({
    type: types.SET_TEXT_DESCRIPTION,
    payload: { slideId, textId, description },
});

const setSlideBackground = (slideId: string, background: Background) => ({
    type: types.SET_SLIDE_BACKGROUND,
    payload: { slideId, background },
});

const chooseSlide = (slideId: string) => ({
    type: types.CHOOSE_SLIDE,
    payload: slideId,
});

const setSelectedObjects = (objectIds: string[] | null) => ({
    type: types.SET_SELECTED_OBJECTS,
    payload: objectIds,
});

const addSelectedObject = (objectId: string) => ({
    type: types.ADD_SELECTED_OBJECT,
    payload: objectId,
});

const removeSelectedObject = (objectId: string) => ({
    type: types.REMOVE_SELECTED_OBJECT,
    payload: objectId,
});

const clearSelectedObjects = () => ({
    type: types.CLEAR_SELECTED_OBJECTS,
});

const openPresentation = (newPres: Editor) => ({
    type: types.OPEN_PRESENTATION,
    payload: newPres,
});

export {
    setPresentationTitle,
    addSlide,
    removeSlides,
    moveSlide,
    addSlideObject,
    removeSlideObject,
    setObjectPositionCoordinates,
    setObjectPositionSize,
    setTextSize,
    setFontFamily,
    setTextColor,
    setTextDescription,
    setSlideBackground,
    chooseSlide,
    setSelectedObjects,
    addSelectedObject,
    removeSelectedObject,
    clearSelectedObjects,
    openPresentation,
}