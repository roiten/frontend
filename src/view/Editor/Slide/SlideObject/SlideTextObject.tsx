import styles from "../../Workspace/Workspace.module.css";
import { dispatch } from "../../../../store/editor.ts";
import {
    removeSlideObject,
    setTextDescription,
} from "../../../../store/actions.ts";
import type { Text } from "../../../../store/types.ts";
import { useState, useRef, type JSX, useEffect } from "react";
import joinStyles from "../../../../utils/joinStyle.ts";
import { useDnd } from "../hooks/useDnd.ts";
import * as React from "react";
import { handleMoveObject } from "../../Workspace/handlers/handleMoveObject.ts";
import { handleResizeObject } from "../../Workspace/handlers/handleResizeObject.ts";

type Props = {
    obj: Text;
    slideId: string;
    isSelected: boolean;
    onClick?: () => void;
};

export default function SlideTextObject({
    obj,
    slideId,
    isSelected,
    onClick,
}: Props): JSX.Element {
    const [isEditing, setIsEditing] = useState(false);
    const [isBorderHovered, setIsBorderHovered] = useState(false);
    const textRef = useRef<HTMLDivElement>(null);

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
            if (isSelected && event.key === "Delete" && !isEditing) {
                event.preventDefault();
                dispatch(removeSlideObject, slideId, obj.id);
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isSelected, isEditing, slideId, obj.id]);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isSelected) {
            e.stopPropagation();
            onClick?.();
        }

        if (isEditing) return;

        e.stopPropagation();
        e.preventDefault();
        setIsEditing(true);

        requestAnimationFrame(() => {
            const element = textRef.current;
            if (!element) return;
            element.focus();

            const pos = document.caretPositionFromPoint(e.clientX, e.clientY);
            if (pos) {
                const range = document.createRange();
                range.setStart(pos.offsetNode, pos.offset);
                range.collapse(true);
                const sel = window.getSelection();
                sel?.removeAllRanges();
                sel?.addRange(range);
            }
        });
    };

    const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
        if (isEditing) {
            setIsEditing(false);
            const newText = e.currentTarget.innerText;
            if (newText !== obj.description) {
                dispatch(setTextDescription, {
                    slideId,
                    textId: obj.id,
                    description: newText,
                });
            }
        }
    };

    const handleBorderMouseEnter = () => {
        if (isSelected) setIsBorderHovered(true);
    };
    const handleBorderMouseLeave = () => setIsBorderHovered(false);

    const handleBorderMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;
        if (target.closest(`.${styles.resizeHandle}`)) return;

        e.preventDefault();
        e.stopPropagation();

        onMouseDown(e);
        if (isEditing) setIsEditing(false);
    };

    return (
        <div
            className={styles.editableObject}
            style={{
                top: `${top}px`,
                left: `${left}px`,
                width: `${width}px`,
                height: `${height}px`,
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "flex-start",
            }}
        >
            <div
                className={joinStyles([
                    styles.borderContainer,
                    isSelected ? styles.selectedBorder : "",
                    isBorderHovered ? styles.moveCursor : "",
                ])}
                onMouseEnter={handleBorderMouseEnter}
                onMouseLeave={handleBorderMouseLeave}
                onMouseDown={isEditing ? () => {} : handleBorderMouseDown}
                style={{ width: "100%", height: "100%" }}
            >
                <div
                    ref={textRef}
                    key={obj.id}
                    className={joinStyles([
                        styles.slideObject,
                        isSelected
                            ? styles.selectedObject
                            : styles.nonSelectedObject,
                    ])}
                    style={{
                        color: obj.font.color,
                        fontSize: `${obj.font.size}px`,
                        fontFamily: obj.font.family,
                        textDecoration: obj.font.textDecoration,
                        userSelect: isEditing ? "text" : "none",
                        cursor: isEditing ? "text" : "default",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        boxSizing: "border-box",
                        padding: "2px",
                        width: "100%",
                        height: "100%",
                        display: "block",
                        overflowWrap: "break-word",
                        outline: "none",
                    }}
                    tabIndex={isSelected ? 0 : -1}
                    onMouseDown={handleMouseDown}
                    onBlur={handleBlur}
                     // onMouseDown={(e) => {
                     //     if (isEditing) e.stopPropagation(); // СОВЕРШЕННО ЗАБЫЛ ЧТО ПРИ onClick просиходит перерендер
                     // }}
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                >
                    {obj.description || "Введите текст"}
                </div>

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
        </div>
    );
}
