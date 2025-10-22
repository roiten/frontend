import styles from "../Workspace.module.css";
import { type Image } from "../../../../store/types.ts";
import { removeSlideObject } from "../../../../store/actions.ts"; // ← из actions!
import { type JSX } from "react";
import joinStyles from "../../../../lib/utils/joinStyle.ts";
import * as React from "react";
import { dispatch } from "../../../../store/editor.ts";

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
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Delete") {
      event.preventDefault();
      dispatch(removeSlideObject, slideId, obj.id);
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
        height: `${obj.size.height}px`,
        opacity: obj.transparency,
      }}
      tabIndex={isSelected ? 0 : -1}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      <img
        className={styles.picture}
        src={obj.source}
        alt="Картинка на слайде"
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />
    </div>
  );
}