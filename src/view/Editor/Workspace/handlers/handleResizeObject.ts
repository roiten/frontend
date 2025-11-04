import { dispatch } from "../../../../store/editor.ts";
import type { SlideObject } from "../../../../store/types.ts";
import { setObjectPositionSize } from "../../../../store/actions.ts";

function handleResizeObject({
    slideId,
    slideObject,
    size,
    position,
}: {
    slideId: string;
    slideObject: SlideObject;
    size: { width: number; height: number };
    position: { x: number; y: number };
}) {
    dispatch(setObjectPositionSize, slideId, slideObject, position, size);
}

export { handleResizeObject };
