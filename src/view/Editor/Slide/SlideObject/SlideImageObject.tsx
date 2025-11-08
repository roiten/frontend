import styles from "../../Workspace/Workspace.module.css";
import { type Image } from "../../../../store/types.ts";
import { removeSlideObject } from "../../../../store/actions.ts";
import { type JSX, useEffect } from "react";
import joinStyles from "../../../../../utils/joinStyle.ts";
import { dispatch } from "../../../../store/editor.ts";
import { useDnd } from "../hooks/useDnd.ts";
import { handleMoveObject } from "../../Workspace/handlers/handleMoveObject.ts";
import { handleResizeObject } from "../../Workspace/handlers/handleResizeObject.ts";
import { ResizeCover } from "../../Common/ResizeCover/ResizeCover.tsx";

type Props = {
    obj: Image;
    slideId: string;
    isSelected: boolean;
    onClick?: () => void;
};

export default function SlideImageObject({
    obj,
    isSelected,
    onClick,
    slideId,
}: Props): JSX.Element {
    const { top, left, width, height, onMouseDown, onResizeDown } = useDnd({
        startX: obj.position.x,
        startY: obj.position.y,
        defaultWidth: obj.size.width,
        defaultHeight: obj.size.height,
        onFinishMove: (newX, newY) => {
            handleMoveObject(slideId, obj, { newX, newY });
        },
        onFinishResize: (newX, newY, newW, newH) => {
            handleResizeObject({
                slideId,
                slideObject: obj,
                size: { width: newW, height: newH },
                position: { x: newX, y: newY },
            });
        },
    });

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (isSelected && event.key === "Delete") {
                event.preventDefault();
                dispatch(removeSlideObject, slideId, obj.id);
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isSelected, slideId, obj.id]);

    return (
        <div
            className={joinStyles([
                styles.slideObject,
                isSelected ? styles.selectedObject : styles.nonSelectedObject,
            ])}
            style={{
                top: `${top}px`,
                left: `${left}px`,
                width: `${width}px`,
                height: `${height}px`,
                opacity: obj.transparency,
                border: isSelected ? "1px dashed red" : "none",
            }}
            tabIndex={isSelected ? 0 : -1}
            onClick={onClick}
            onMouseDown={onClick ? onMouseDown : undefined}
        >
            <img
                className={styles.picture}
                draggable={!!onClick}
                contentEditable={false}
                src={obj.source}
                alt="Картинка на слайде"
            />
            {isSelected && (<ResizeCover onResizeDown={onResizeDown} /> )}
        </div>
    );
}
