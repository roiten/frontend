import styles from "../../Workspace/Workspace.module.css";
import { dispatch } from "../../../../store/editor.ts";
import {
    removeSlideObject,
    setTextDescription,
} from "../../../../store/actions.ts";
import type { Text } from "../../../../store/types.ts";
import { useState, type JSX } from "react";
import joinStyles from "../../../../utils/joinStyle.ts";

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

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (!isEditing && event.key === "Delete") {
            event.preventDefault();
            dispatch(removeSlideObject, slideId, obj.id);
        }
    };

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if (!isSelected) {
            onClick?.();
        } else if (!isEditing) {
            setIsEditing(true);
        }
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

    return (
        <div
            className={joinStyles([
                styles.slideObject,
                isSelected ? styles.selectedObject : styles.nonSelectedObject,
            ])}
            style={{
                top: `${obj.position.y}px`,
                left: `${obj.position.x}px`,
                width: `${obj.size.width}px`,
                cursor: isEditing ? "text" : "default",
                color: obj.font.color,
                fontSize: `${obj.font.size}px`,
                textDecoration: obj.font.textDecoration,
                fontFamily: obj.font.family,
                userSelect: isEditing ? "text" : "none",
            }}
            tabIndex={isSelected ? 0 : -1}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            contentEditable={isEditing}
            suppressContentEditableWarning
        >
            {obj.description || "Введите текст"}
        </div>
    );
}
