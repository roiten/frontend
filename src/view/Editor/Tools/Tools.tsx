import styles from "./Tools.module.css";
import { useEffect, useState, useCallback } from "react";
import type { Slide, SlideObject } from "../../../store/types.ts";
import SquareButton from "../Common/Button/SquareButton/SquareButton.tsx";
import {
    addSlideObject,
    editFontFamily,
    editTextColor,
    editTextSize,
} from "../../../store/reducers/slidesReducer.ts";
import { toggleHistoryPanel } from "../../../store/reducers/uiReducer.ts";
import { TEXT_PRESETS } from "../../../store/default.ts";
import { v4 as uuid } from "uuid";
import { getTextObjectById } from "../../../store/selectors.ts";
import { useAppDispatch, useAppSelector } from "../../../store/store.ts";
import { useNavigate } from "react-router";

type Tool = {
    name: string;
    icon?: string;
    action?: () => void;
};

type ToolsProps = {
    onToolAction?: (toolName: string) => void;
};

function getTextSelectionInfo(
    selectedObjectIds: string[],
    selection: {
        currentSlide: string | null;
        selectedObjects: string[] | null;
    },
    slides: Slide[],
) {
    const hasSelection = selectedObjectIds.length > 0;
    const textObjects = selectedObjectIds.map((id) =>
        getTextObjectById(selection, slides, id),
    );
    const hasNoText = textObjects.some((obj) => obj === null);
    const allAreText = hasSelection && !hasNoText;
    return { textObjects, allAreText };
}

export default function Tools({ onToolAction }: ToolsProps) {
    const dispatch = useAppDispatch();
    const showHistorySidePanel = useAppSelector(
        (state) => state.ui.showHistoryPanel,
    );

    const { present } = useAppSelector((state) => state.editor);
    const slides = present.slides;
    const selection = present.selection;
    const selectedObjectIds = selection.selectedObjects || [];
    const navigate = useNavigate();

    const [tempFontSize, setTempFontSize] = useState<string>("");
    const [tempColor, setTempColor] = useState<string>("#000000");
    const presentationId = useAppSelector(
        (state) => state.editor.present.meta.presentationId,
    );

    const playBtn = { name: "", icon: "/icons/play2.svg" };

    const checkPresentationOpened = () => {
        return presentationId != "";
    };

    const handleAddText = useCallback(() => {
        const slideId = selection.currentSlide;
        if (!slideId) return;

        const newText: SlideObject = {
            id: uuid(),
            ...TEXT_PRESETS,
        };
        dispatch(addSlideObject({ slideId, obj: newText }));
    }, [selection.currentSlide, slides, dispatch]);

    const handleEditFontSize = useCallback(
        (textIds: string[], size: number) => {
            const slideId = selection.currentSlide;
            if (!slideId) return;
            const slide = slides.find((s: Slide) => s.id === slideId);
            if (!slide) return;
            textIds.forEach((id) =>
                dispatch(editTextSize({ slideId, textId: id, size })),
            );
        },
        [selection.currentSlide, slides, dispatch],
    );

    const handleEditFontFamily = useCallback(
        (textIds: string[], family: string) => {
            const slideId = selection.currentSlide;
            if (!slideId) return;
            const slide = slides.find((s: Slide) => s.id === slideId);
            if (!slide) return;
            textIds.forEach((id) =>
                dispatch(editFontFamily({ slideId, textId: id, family })),
            );
        },
        [selection.currentSlide, slides, dispatch],
    );

    const handleEditFontColor = useCallback(
        (textIds: string[], color: string) => {
            const slideId = selection.currentSlide;
            if (!slideId) return;
            const slide = slides.find((s: Slide) => s.id === slideId);
            if (!slide) return;
            textIds.forEach((id) =>
                dispatch(editTextColor({ slideId, textId: id, color })),
            );
        },
        [selection.currentSlide, slides, dispatch],
    );

    const tools: Tool[] = [
        {
            name: "Новый текст",
            icon: "/icons/text-t.svg",
            action: handleAddText,
        },
        {
            name: "Фон",
            icon: "/icons/wall.svg",
            action: () => onToolAction?.("background"),
        },
        {
            name: "URL-картинка",
            icon: "/icons/shapes.svg",
            action: () => onToolAction?.("image-url"),
        },
        {
            name: "История изменений",
            icon: "/icons/clock-counter-clockwise.svg",
            action: () => {
                console.log(showHistorySidePanel);
                dispatch(toggleHistoryPanel());
                console.log(showHistorySidePanel);
            },
        },
    ];

    useEffect(() => {
        const { textObjects, allAreText } = getTextSelectionInfo(
            selectedObjectIds,
            selection,
            slides,
        );
        if (allAreText && textObjects.length === 1) {
            setTempFontSize(String(textObjects[0]!.font.size));
            setTempColor(textObjects[0]!.font.color);
        } else {
            setTempFontSize("");
            setTempColor("#000000");
        }
    }, [selectedObjectIds, selection, slides]);

    const { textObjects, allAreText } = getTextSelectionInfo(
        selectedObjectIds,
        selection,
        slides,
    );

    const fontFamily =
        allAreText && textObjects.length === 1
            ? textObjects[0]!.font.family
            : "";

    return (
        <div className={styles.tools}>
            {tools.map((tool) => (
                <SquareButton
                    key={tool.name}
                    tool={tool}
                    onClick={
                        checkPresentationOpened()
                            ? () => tool.action?.()
                            : () => {}
                    }
                />
            ))}

            <form>
                <select
                    name="font"
                    id="fontSelect"
                    disabled={!allAreText}
                    value={fontFamily}
                    onChange={(e) => {
                        if (allAreText) {
                            handleEditFontFamily(
                                selectedObjectIds,
                                e.currentTarget.value,
                            );
                        }
                    }}
                >
                    <option value="">—</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Segoe UI">Segoe UI</option>
                    <option value="Comic Sans MS">Comic Sans MS</option>
                    <option value="Calibri">Calibri</option>
                    <option value="Arial">Arial</option>
                    <option value="Roboto">Roboto</option>
                </select>
            </form>

            <input
                type="number"
                disabled={!allAreText}
                value={tempFontSize}
                onChange={(e) => {
                    const input = e.currentTarget.value;
                    setTempFontSize(input);
                    if (input === "") return;
                    const value = Number(input);
                    if (allAreText && !isNaN(value) && value > 0) {
                        handleEditFontSize(selectedObjectIds, value);
                    }
                }}
                min="1"
                step="1"
            />

            <input
                type="color"
                disabled={!allAreText}
                value={tempColor}
                onChange={(e) => setTempColor(e.currentTarget.value)}
                onBlurCapture={() => {
                    if (allAreText) {
                        handleEditFontColor(selectedObjectIds, tempColor);
                    }
                }}
            />
            <SquareButton
                key="play"
                tool={playBtn}
                onClick={() => {
                    navigate("/show");
                }}
            />
        </div>
    );
}
