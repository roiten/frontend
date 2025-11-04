import { dispatch } from "../../../../store/editor.ts";
import {setObjectPositionCoordinates} from "../../../../store/actions.ts";
import type { SlideObject } from "../../../../store/types.ts";

function handleMoveObject(slideId: string, slideObject: SlideObject, position: {newX: number, newY: number}) {
    console.log(position);
    dispatch(setObjectPositionCoordinates, slideId, slideObject, {
        x: position.newX,
        y: position.newY
    });}

export { handleMoveObject };
