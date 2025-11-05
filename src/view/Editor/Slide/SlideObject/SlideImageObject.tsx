import styles from "../../Workspace/Workspace.module.css";
import { type Image } from "../../../../store/types.ts";
import { removeSlideObject } from "../../../../store/actions.ts";
import { type JSX, useEffect } from "react";
import joinStyles from "../../../../../utils/joinStyle.ts";
import { dispatch } from "../../../../store/editor.ts";
import { useDnd } from "../hooks/useDnd.ts";
import { handleMoveObject } from "../../Workspace/handlers/handleMoveObject.ts";
import { handleResizeObject } from "../../Workspace/handlers/handleResizeObject.ts";

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
            console.log("drag ended at", newX, newY);
            handleMoveObject(slideId, obj, { newX, newY });
        },
        onFinishResize: (newX, newY, newWidth, newHeight) => {
            console.log("resize ended:", newX, newY, newWidth, newHeight);
            handleResizeObject({
                slideId,
                slideObject: obj,
                size: { width: newWidth, height: newHeight },
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
                src={obj.source}
                alt="Картинка на слайде"
            />
            {isSelected && (
                <>
                    <div
                        className={joinStyles([
                            styles.resizeHandle,
                            styles.resizeHandleTopLeft,
                        ])}
                        onMouseDown={onResizeDown("tl")}
                    />
                    <div
                        className={joinStyles([
                            styles.resizeHandle,
                            styles.resizeHandleTopRight,
                        ])}
                        onMouseDown={onResizeDown("tr")}
                    />
                    <div
                        className={joinStyles([
                            styles.resizeHandle,
                            styles.resizeHandleBottomLeft,
                        ])}
                        onMouseDown={onResizeDown("bl")}
                    />
                    <div
                        className={joinStyles([
                            styles.resizeHandle,
                            styles.resizeHandleBottomRight,
                        ])}
                        onMouseDown={onResizeDown("br")}
                    />
                    <div
                        className={joinStyles([
                            styles.resizeHandle,
                            styles.resizeHandleTop,
                        ])}
                        onMouseDown={onResizeDown("t")}
                    />
                    <div
                        className={joinStyles([
                            styles.resizeHandle,
                            styles.resizeHandleLeft,
                        ])}
                        onMouseDown={onResizeDown("l")}
                    />
                    <div
                        className={joinStyles([
                            styles.resizeHandle,
                            styles.resizeHandleBottom,
                        ])}
                        onMouseDown={onResizeDown("b")}
                    />
                    <div
                        className={joinStyles([
                            styles.resizeHandle,
                            styles.resizeHandleRight,
                        ])}
                        onMouseDown={onResizeDown("r")}
                    />
                </>
            )}
        </div>
    );
}
