import type { Slide } from "../../../store/types.ts";
import styles from "./Workspace.module.css";
import SlideRenderer from "../Slide/SlideRenderer.tsx";

type Props = {
    slide: Slide | undefined;
    selectedObjects: string[] | null;
    scale?: number;
    onSelectObject: (objectId: string, isSelected: boolean) => void;
    onClearSelection: () => void;
};

export default function Workspace({
    slide,
    selectedObjects = null,
    scale = 0.85,
    onSelectObject,
    onClearSelection,
}: Props) {
    const handleSelectObject = (objectId: string) => {
        const isCurrentlySelected =
            selectedObjects?.includes(objectId) || false;
        onSelectObject(objectId, !isCurrentlySelected);
    };

    const handleWorkspaceClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget && onClearSelection) {
            onClearSelection();
        }
    };

    if (!slide)
        return <div className={styles.wrapper}>Нет выбранного слайда</div>;

    return (
        <div className={styles.wrapper} onClick={handleWorkspaceClick}>
            <SlideRenderer
                slide={slide}
                scale={scale}
                selectedObjectIds={selectedObjects}
                onSelectObject={handleSelectObject}
            />
        </div>
    );
}
