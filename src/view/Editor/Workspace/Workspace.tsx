import styles from "./Workspace.module.css";
import SlideRenderer from "../Slide/SlideRenderer.tsx";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addSlideObject } from "../../../store/actionCreators.ts";
import { IMAGE_PRESETS } from "../../../store/default.ts";
import * as React from "react";
import { v4 as uuid } from "uuid";
import type { Editor } from "../../../store/types.ts";

type Props = {
    scale?: number;
    onSelectObject: (objectId: string, isSelected: boolean) => void;
    onClearSelection: (e: React.MouseEvent<HTMLDivElement>) => void;
};

export default function Workspace({
    scale = 0.85,
    onSelectObject,
    onClearSelection,
}: Props) {
    const editor = useSelector((state: Editor) => state);
    const dispatch = useDispatch();

    const selectedObjects = editor.selectedObjects || [];
    const slide = editor.slides.find((s) => s.id === editor.currentSlide);

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

    const handlePaste = useCallback(
        async (e: React.ClipboardEvent) => {
            const items = e.clipboardData.items;
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                if (item.type.startsWith("image/")) {
                    const file = item.getAsFile();
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                            const dataUrl = reader.result as string;
                            addImageFromUrl(dataUrl);
                        };
                        reader.readAsDataURL(file);
                        e.preventDefault();
                        break;
                    }
                }
            }
        },
        [editor.currentSlide, dispatch],
    );

    const addImageFromUrl = useCallback(
        (url: string) => {
            const img = new Image();
            img.onload = () => {
                const naturalWidth = img.naturalWidth;
                const naturalHeight = img.naturalHeight;

                const MAX_WIDTH = 1200;
                const MAX_HEIGHT = 800;

                let width = naturalWidth;
                let height = naturalHeight;

                const scale = Math.min(
                    MAX_WIDTH / width,
                    MAX_HEIGHT / height,
                    1,
                );
                width = width * scale;
                height = height * scale;

                const slideId = editor.currentSlide;
                if (!slideId) return;

                dispatch(
                    addSlideObject(slideId, {
                        ...IMAGE_PRESETS,
                        id: uuid(),
                        source: url,
                        size: { width, height },
                    }),
                );
            };
            img.src = url;
        },
        [editor.currentSlide, dispatch],
    );

    if (!slide)
        return <div className={styles.wrapper}>Нет выбранного слайда</div>;

    return (
        <div className={styles.wrapper} tabIndex={0} onPaste={handlePaste}>
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
