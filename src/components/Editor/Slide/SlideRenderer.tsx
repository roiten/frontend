import type { Slide, SlideObject } from "../../../store/types.ts";
import SlideTextObject from "./SlideObject/SlideTextObject.tsx";
import SlideImageObject from "./SlideObject/SlideImageObject.tsx";
import styles from "../Workspace/Workspace.module.css";

type Props = {
    slide: Slide;
    scale?: number;
    canClickObject: boolean;
    selectedObjectIds?: string[] | null;
    onSelectObject?: (objectId: string) => void;
    clearSelectedObjects?: (e: React.MouseEvent<HTMLDivElement>) => void;
};

export default function SlideRenderer({
    slide,
    scale = 1,
    selectedObjectIds = null,
    canClickObject,
    onSelectObject,
    clearSelectedObjects,

}: Props) {

    const isSelected = (id: string): boolean => {
        if (!selectedObjectIds) return false;
        return selectedObjectIds.includes(id)
    };

    const backgroundStyle =
        slide.background.type === "color"
            ? { backgroundColor: slide.background.color }
            : {
                  backgroundImage: `url(${slide.background.source})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
              };

    return (
        <div
            className={styles.scaledContainer}
            onClick={clearSelectedObjects}
            style={{
                transform: `scale(${scale})`,
                transformOrigin: "top left",
            }}
        >
            <div className={styles.workspace} style={backgroundStyle} onClick={clearSelectedObjects}>
                {slide.content.map((obj: SlideObject) => {
                    if (obj.type === "text") {
                        return (
                            <SlideTextObject
                                key={obj.id}
                                obj={obj}
                                slideId={slide.id}
                                isSelected={isSelected(obj.id)}
                                canClickObject={canClickObject}
                                onClick={() => onSelectObject?.(obj.id)}
                            />
                        );
                    } else if (obj.type === "image") {
                        return (
                            <SlideImageObject
                                key={obj.id}
                                obj={obj}
                                slideId={slide.id}
                                isSelected={isSelected(obj.id)}
                                canClickObject={canClickObject}
                                onClick={() => onSelectObject?.(obj.id)}
                            />
                        );
                    }
                    return null;
                })}
            </div>
        </div>
    );
}
