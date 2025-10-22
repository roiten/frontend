import styles from "../Workspace.module.css";
import { dispatch } from "../../../../store/editor.ts";
import {
  removeSlideObject,
  setTextDescription,
} from "../../../../store/actions.ts";
import type { Text } from "../../../../store/types.ts";
import { type JSX, useState } from "react";
import joinStyles from "../../../../lib/utils/joinStyle.ts";

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
    if (event.key === "Delete" && !isEditing) {
      event.preventDefault();
      dispatch(removeSlideObject, slideId, obj.id);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    setIsEditing(false); // выходим из режима редактирования
    const newText = e.currentTarget.innerText;
    if (newText !== obj.description) {
      dispatch(setTextDescription, {
        slideId,
        textId: obj.id,
        description: newText,
      });
    }
  };

  const handleSingleClick = () => {
    if (!isEditing) {
      onClick?.();
    }
  };

  const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsEditing(true);
  };

  return (
    <div
      className={joinStyles([
        styles.slideObject,
        isSelected ? styles.selectedObject : styles.nonSelectedObject,
      ])}
      style={{
        position: "absolute",
        top: `${obj.position.y}px`,
        left: `${obj.position.x}px`,
        width: `${obj.size.width}px`,
        color: obj.font.color,
        fontSize: `${obj.font.size}px`,
        textDecoration: obj.font.textDecoration,
        fontFamily: obj.font.family,
      }}
      contentEditable={isEditing}
      suppressContentEditableWarning
      tabIndex={isSelected && !isEditing ? 0 : -1}
      onClick={handleSingleClick}
      onDoubleClick={handleDoubleClick}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
    >
      {obj.description || "Введите текст"}
    </div>
  );
}
