import styles from "./Workspace.module.css";
import SlideRenderer from "../Slide/SlideRenderer.tsx";
import { useCallback, useEffect } from "react";
import {
    addNote,
    addSlideObject,
} from "../../../store/reducers/slidesReducer.ts";
import { IMAGE_PRESETS } from "../../../store/default.ts";
import * as React from "react";
import { v4 as uuid } from "uuid";
import * as appWrite from "../../../store/appWrite/api.ts";
import { useAppSelector, useAppDispatch } from "../../../store/store.ts";

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
    const slides = useAppSelector((state) => state.editor.present.slides);
    const selection = useAppSelector((state) => state.editor.present.selection);
    const dispatch = useAppDispatch();

    const selectedObjects = selection.selectedObjects || [];
    const slide = slides.find((s) => s.id === selection.currentSlide);
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

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

    useEffect(() => {
        if (slide) {
            if (textareaRef.current) {
                textareaRef.current.value = slide.note || "";
            }
        }
    }, [selection.currentSlide]);

    const handleNoteTyped = () => {
        if (textareaRef.current) {
            if (selection.currentSlide) {
                const value = textareaRef.current.value;

                dispatch(
                    addNote({
                        slideId: selection.currentSlide,
                        note: value,
                    }),
                );
            }
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
                        reader.readAsDataURL(file);

                        reader.onload = async () => {
                            const data = reader.result as string;
                            const serverUrl = await appWrite.sendMedia(data);
                            addImageFromUrl(serverUrl);
                            console.log("Image pasted:", serverUrl);
                        };
                    }
                }
            }
        },
        [selection.currentSlide],
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

                const slideId = selection.currentSlide;
                if (!slideId) return;

                dispatch(
                    addSlideObject({
                        slideId,
                        obj: {
                            ...IMAGE_PRESETS,
                            id: uuid(),
                            source: url,
                            size: { width, height },
                        },
                    }),
                );
            };
            img.src = url;
        },
        [selection.currentSlide, dispatch],
    );

    if (!slide)
        return <div className={styles.wrapper}>Нет выбранного слайда</div>;

    return (
        <div className={styles.wrapper} tabIndex={0} onPaste={handlePaste}>
            <SlideRenderer
                slide={slide}
                scale={scale}
                mode={"edit"}
                selectionProps={{
                    selectedObjectIds: selectedObjects,
                    onSelectObject: handleSelectObject,
                    onDeselectObject: handleWorkspaceClick,
                }}
            />
            <textarea
                ref={textareaRef}
                className={styles.note}
                id="slideNote"
                name="slideNote"
                placeholder="Введите комментарий к слайду"
                rows={3}
                onBlur={handleNoteTyped}
            />
        </div>
    );
}
