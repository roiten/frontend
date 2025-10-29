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

type Props = {
    obj: Text;
    slideId: string;
    isSelected: boolean;
    canClickObject: boolean;
    onClick?: () => void;
};

export default function SlideTextObject({
    obj,
    slideId,
    isSelected,
    canClickObject,
    onClick,
}: Props): JSX.Element {
    const [isEditing, setIsEditing] = useState(false);
    const [isBorderHovered, setIsBorderHovered] = useState(false);
    const textRef = useRef<HTMLDivElement>(null);

    const { top, left, onMouseDown } = useDnd({
        startX: obj.position.x,
        startY: obj.position.y,
        onMouseMove: () => {},
        onFinish: (newX, newY) => {
            console.log("drag ended at", newX, newY);
            handleMoveObject(slideId, obj, { newX, newY });
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

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if (!isSelected) onClick?.();
        setIsEditing(true);

        setTimeout(() => {
            const element = textRef.current;
            if (!element) return;
            element.focus();

            const position = document.caretPositionFromPoint(e.clientX, e.clientY);
            if (position) {
                const range = document.createRange();
                range.setStart(position.offsetNode, position.offset);
                range.collapse(true);
                const selection = window.getSelection();
                selection?.removeAllRanges();
                selection?.addRange(range);
            }
        }, 0);
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
        if (isSelected) {
            setIsBorderHovered(true);
        }
    };

    const handleBorderMouseLeave = () => {
        setIsBorderHovered(false);
    };

    const handleBorderMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (canClickObject) {
            onMouseDown(e);
            if (isEditing) {
                setIsEditing(false);
            }
        }
    };
    return (
        <div
            className={styles.editableObject}
            style={{
                top: `${top}px`,
                left: `${left}px`,
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
                onMouseDown={handleBorderMouseDown}
            >
                <div
                    ref={textRef}
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
                        padding: '2px',
                    }}
                    tabIndex={isSelected ? 0 : -1}
                    onClick={handleClick}
                    onBlur={handleBlur}
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
                        />
                        <div
                            className={joinStyles([
                                styles.resizeHandle,
                                styles.resizeHandleTopRight,
                            ])}
                        />
                        <div
                            className={joinStyles([
                                styles.resizeHandle,
                                styles.resizeHandleBottomLeft,
                            ])}
                        />
                        <div
                            className={joinStyles([
                                styles.resizeHandle,
                                styles.resizeHandleBottomRight,
                            ])}
                        />
                    </>
                )}
            </div>
        </div>
    );
}
