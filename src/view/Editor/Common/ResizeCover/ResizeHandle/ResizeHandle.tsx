import joinStyles from "../../../../../../utils/joinStyle.ts";
import styles from "../ResizeCover.module.css";
import type { MouseEventHandler } from "react";
import type { ResizeCorner } from "../types.ts";

function chooseResizeHandlerStyle(corner: ResizeCorner) {
    switch (corner) {
        case "t":
            return styles.resizeHandleTop;
        case "tr":
            return styles.resizeHandleTopRight;
        case "r":
            return styles.resizeHandleRight;
        case "br":
            return styles.resizeHandleBottomRight;
        case "b":
            return styles.resizeHandleBottom;
        case "bl":
            return styles.resizeHandleBottomLeft;
        case "l":
            return styles.resizeHandleLeft;
        default:
            return styles.resizeHandleTopLeft;
    }
}

type ResizeHandleProps = {
    onResizeDown: (corner: ResizeCorner) => MouseEventHandler<HTMLDivElement>;
    resizeCorner: ResizeCorner;
};

function ResizeHandle({ onResizeDown, resizeCorner }: ResizeHandleProps) {
    return (
        <>
            <div
                className={joinStyles([
                    styles.resizeHandle,
                    chooseResizeHandlerStyle(resizeCorner),
                ])}
                onMouseDown={onResizeDown(resizeCorner)}
            />
        </>
    );
}

export { ResizeHandle };
