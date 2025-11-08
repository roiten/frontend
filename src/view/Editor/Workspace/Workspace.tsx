import type { Slide } from "../../../store/types.ts";
import styles from "./Workspace.module.css";
import SlideRenderer from "../Slide/SlideRenderer.tsx";
import { useCallback } from "react";
import { handlePasteImageUrl } from "../Modal/handlers/handlePasteImage.ts";

type Props = {
    slide: Slide | undefined;
    selectedObjects: string[] | null;
    scale?: number;
    onSelectObject: (objectId: string, isSelected: boolean) => void;
    onClearSelection: (e: React.MouseEvent<HTMLDivElement>) => void;
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
            onClearSelection(e);
        }
    };

    const handlePaste = useCallback(async (e: React.ClipboardEvent) => {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.type.startsWith("image/")) {
                const file = item.getAsFile();
                if (file) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        const dataUrl = reader.result as string;
                        handlePasteImageUrl(dataUrl);
                    };
                    reader.readAsDataURL(file);
                    e.preventDefault();
                    break;
                }
            }
        }
    }, []);

    if (!slide)
        return <div className={styles.wrapper}>Нет выбранного слайда</div>;

    return (
        <div
            className={styles.wrapper}
            tabIndex={0}
            onPaste={handlePaste}
        >
                <SlideRenderer
                    slide={slide}
                    scale={scale}
                    selectionProps={{
                        selectedObjectIds: selectedObjects,
                        onSelectObject: handleSelectObject,
                        onDeselectObject: handleWorkspaceClick,
                    }}
                />
        </div>
    );
}
