import type { Slide, SlideObject } from "../../../store/types.ts";
import SlideTextObject from "./SlideObject/SlideTextObject.tsx";
import SlideImageObject from "./SlideObject/SlideImageObject.tsx";
import styles from "../Workspace/Workspace.module.css";

type Props = {
    slide: Slide;
    scale?: number;
    selectionProps?: {
        selectedObjectIds: string[] | null;
        onSelectObject: (objectId: string) => void;
        onDeselectObject: (e: React.MouseEvent<HTMLDivElement>) => void;
    };
};

export default function SlideRenderer({
    slide,
    scale = 1,
    selectionProps,
}: Props) {
    const isSelected = (id: string): boolean => {
        return !!selectionProps?.selectedObjectIds?.includes(id);
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
            onClick={selectionProps?.onDeselectObject}
            style={{
                transform: `scale(${scale})`,
            }}
        >
            <div
                className={styles.workspace}
                style={backgroundStyle}
                onClick={selectionProps?.onDeselectObject}
            >
                {slide.content.map((obj: SlideObject) => {
                    if (obj.type === "text") {
                        return (
                            <SlideTextObject
                                key={obj.id}
                                obj={obj}
                                slideId={slide.id}
                                isSelected={isSelected(obj.id)}
                                onClick={
                                    selectionProps
                                        ? () =>
                                            selectionProps.onSelectObject(
                                                obj.id,
                                            )
                                        : undefined
                                }
                            />
                        );
                    } else if (obj.type === "image") {
                        return (
                            <SlideImageObject
                                key={obj.id}
                                obj={obj}
                                slideId={slide.id}
                                isSelected={isSelected(obj.id)}
                                onClick={
                                    selectionProps
                                        ? () =>
                                              selectionProps.onSelectObject(
                                                  obj.id,
                                              )
                                        : undefined
                                }
                            />
                        );
                    }
                    return null;
                })}
            </div>
        </div>
    );
}
