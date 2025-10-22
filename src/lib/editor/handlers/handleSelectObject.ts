import { dispatch } from "../../../store/editor.ts";
import {
  addSelectedObject,
  clearSelectedObjects,
  removeSelectedObject,
} from "../../../store/types.ts";

function handleSelectObject(objectId: string, isSelected: boolean) {
  if (isSelected) {
    dispatch(addSelectedObject, objectId);
  } else {
    dispatch(removeSelectedObject, objectId);
  }
}

function handleClearSelection() {
  dispatch(clearSelectedObjects);
}

export { handleSelectObject, handleClearSelection };