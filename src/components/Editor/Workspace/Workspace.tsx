import type { Slide, SlideObject } from "../../../store/types.ts";
import styles from "./Workspace.module.css";
import SlideTextObject from "./SlideObject/SlideTextObject.tsx";
import SlideImageObject from "./SlideObject/SlideImageObject.tsx";

type Props = {
    slide: Slide | undefined;
    selectedObjects?: string[] | null;
    scale?: number;
    onSelectObject?: (objectId: string, isSelected: boolean) => void;
    onClearSelection?: () => void;
};

export default function Workspace({
    slide,
    selectedObjects = null,
    scale = 0.85,
    onSelectObject,
    onClearSelection,
}: Props) {
    const isSelected = (objectId: string) =>
        selectedObjects?.includes(objectId) || false;

    const handleSelectObject = (objectId: string) => {
        const isCurrentlySelected = isSelected(objectId);
        if (onSelectObject) onSelectObject(objectId, !isCurrentlySelected);
    };

    const handleWorkspaceClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget && onClearSelection) {
            onClearSelection();
        }
    };

    if (!slide)
        return <div className={styles.wrapper}>Нет выбранного слайда</div>;

    const backgroundStyle =
        slide.background.type === "color"
            ? { backgroundColor: slide.background.color }
            : {
                  backgroundImage: `url(${slide.background.source})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
              };

    return (
        <div className={styles.wrapper}>
            <div
                className={styles.scaledContainer}
                style={{ transform: `scale(${scale})` }}
            >
                <div
                    className={styles.workspace}
                    style={backgroundStyle}
                    onClick={handleWorkspaceClick}
                >
                    {slide.content.map((obj: SlideObject) => {
                        if (obj.type === "text") {
                            return (
                                <SlideTextObject
                                    obj={obj}
                                    slideId={slide.id}
                                    key={obj.id}
                                    isSelected={isSelected(obj.id)}
                                    onClick={() => handleSelectObject(obj.id)}
                                />
                            );
                        } else if (obj.type === "image") {
                            return (
                                <SlideImageObject
                                    obj={obj}
                                    key={obj.id}
                                    slideId={slide.id}
                                    isSelected={isSelected(obj.id)}
                                    onClick={() => handleSelectObject(obj.id)}
                                />
                            );
                        }
                        return null;
                    })}
                </div>
            </div>
        </div>
    );
}
