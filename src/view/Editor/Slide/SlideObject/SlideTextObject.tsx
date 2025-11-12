import styles from "../../Workspace/Workspace.module.css";
import {
    removeSlideObject,
    setObjectPositionCoordinates,
    setObjectPositionSize,
    setTextDescription,
} from "../../../../store/actionCreators.ts";
import type { SlideObject, Text } from "../../../../store/types.ts";
import { useState, useRef, type JSX, useEffect } from "react";
import joinStyles from "../../../../../utils/joinStyle.ts";
import { useDnd } from "../hooks/useDnd.ts";
import * as React from "react";
import { ResizeCover } from "../../Common/ResizeCover/ResizeCover.tsx";
import { useDispatch } from "react-redux";

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
    const dispatch = useDispatch();

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
                dispatch(removeSlideObject(slideId, obj.id));
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isSelected, isEditing, slideId, obj.id]);

    const handleMoveObject = (
        slideId: string,
        slideObject: SlideObject,
        position: { newX: number; newY: number },
    ) => {
        dispatch(
            setObjectPositionCoordinates(slideId, slideObject, {
                x: position.newX,
                y: position.newY,
            }),
        );
    };

    const handleResizeObject = ({
                                    slideId,
                                    slideObject,
                                    size,
                                    position,
                                }: {
        slideId: string;
        slideObject: SlideObject;
        size: { width: number; height: number };
        position: { x: number; y: number };
    }) => {
        dispatch(setObjectPositionSize(slideId, slideObject, position, size));
    };

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

            const position = document.caretPositionFromPoint(e.clientX, e.clientY);
            if (position) {
                const range = document.createRange();
                range.setStart(position.offsetNode, position.offset);
                range.collapse(true);
                const selection = window.getSelection();
                selection?.removeAllRanges();
                selection?.addRange(range);
            }
        });
    };

    const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
        if (isEditing) {
            setIsEditing(false);
            const newText = e.currentTarget.innerText;
            if (newText !== obj.description) {
                dispatch(setTextDescription(
                    slideId,
                    obj.id,
                    newText,
                ));
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
                    }}
                    tabIndex={isSelected ? 0 : -1}
                    onMouseDown={handleMouseDown}
                    onBlur={handleBlur}
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                >
                    {obj.description || "Введите текст"}
                </div>
                {isSelected && (<ResizeCover onResizeDown={onResizeDown} /> )}
            </div>
        </div>
    );
}
