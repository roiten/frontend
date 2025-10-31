import styles from "../../Workspace/Workspace.module.css";
import { type Image } from "../../../../store/types.ts";
import { removeSlideObject } from "../../../../store/actions.ts";
import { type JSX, useEffect } from "react";
import joinStyles from "../../../../utils/joinStyle.ts";
import { dispatch } from "../../../../store/editor.ts";
import { useDnd } from "../hooks/useDnd.ts";
import { handleMoveObject } from "../../Workspace/handlers/handleMoveObject.ts";

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
    const { top, left, onMouseDown } = useDnd({
        startX: obj.position.x,
        startY: obj.position.y,
        onMouseMove: () => {},
        onFinish: (newX, newY) => {
            console.log("drag ended at", newX, newY);
            handleMoveObject(slideId, obj, {newX, newY});

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
                width: `${obj.size.width}px`,
                height: `${obj.size.height}px`,
                opacity: obj.transparency,
                border: isSelected ? "1px dashed red" : "none",
            }}
            tabIndex={isSelected ? 0 : -1}
            onClick={onClick}
            onMouseDown={onClick ? onMouseDown : () => {}}
        >
            <img
                className={styles.picture}
                draggable={!!onClick}
                src={obj.source}
                alt="Картинка на слайде"
            />
        </div>
    );
}
