import styles from "./Tools.module.css";
import { useEffect, useState, useCallback } from "react";
import type { Editor, Slide, SlideObject } from "../../../store/types.ts";
import SquareButton from "../Common/Button/SquareButton/SquareButton.tsx";
import {
    addSlideObject,
    editFontFamily,
    editTextColor,
    editTextSize,
    set as setSlides,
} from "../../../store/reducers/slidesReducer.ts";
import { set as setSelection } from "../../../store/reducers/selectionReducer.ts";
import {
    set as setPresentation,
    // setPresentationId,
} from "../../../store/reducers/presentationReducer.ts";
import { TEXT_PRESETS } from "../../../store/default.ts";
import { v4 as uuid } from "uuid";
import { getTextObjectById } from "../../../store/selectors.ts";
import * as React from "react";
import { useAppDispatch, useAppSelector } from "../../../store/store.ts";
// import * as appWrite from "../../../store/appWrite/api";

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

    const { present } = useAppSelector((state: Editor) => state);
    const slides = present.slides;
    const selection = present.selection;
    const selectedObjectIds = selection.selectedObjects || [];

    const [, setFile] = useState<File | null>(null);
    const [tempFontSize, setTempFontSize] = useState<string>("");
    const [tempColor, setTempColor] = useState<string>("#000000");
    const presentationId = useAppSelector(
        (state) => state.present.meta.presentationId,
    );

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
        // {
        //     name: "Сохранить",
        //     icon: "icons/floppy-disk.svg",
        //     action: async () => {
        //         const user = await appWrite.getCurrentUser();
        //         if (!user) {
        //             alert(
        //                 "Пользователь не авторизован. Сохранение невозможно.",
        //             );
        //             return;
        //         }

        //         const userId = user.$id;

        //         if (presentationId) {
        //             try {
        //                 const pres = await appWrite.updatePresentationDocument(
        //                     presentationId,
        //                     present,
        //                 );
        //                 dispatch(setSlides(pres.processedData.slides));
        //                 console.log("Обновлено:", presentationId);
        //             } catch (err) {
        //                 console.error("Ошибка обновления:", err);
        //             }
        //         } else {
        //             try {
        //                 const pres = await appWrite.createPresentationDocument(
        //                     userId,
        //                     present,
        //                 );
        //                 const newId = pres.document.$id;

        //                 dispatch(setPresentationId(newId));
        //                 dispatch(setSlides(pres.processedData.slides));
        //                 console.log("Создано и сохранено ID:", newId);
        //             } catch (err) {
        //                 console.error("Ошибка создания:", err);
        //             }
        //         }
        // },
        // },
        {
            name: "Загрузить из облака",
            icon: "/icons/cloud-arrow-down.svg",
            action: () => onToolAction?.("slides-list"),
        },
    ];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] ?? null;
        if (selectedFile) {
            setFile(selectedFile);
            readFileAsObject(selectedFile);
        }
    };

    const readFileAsObject = (file: File) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target?.result) {
                try {
                    const parsed = JSON.parse(event.target.result as string);
                    dispatch(setPresentation(parsed.meta));
                    dispatch(setSlides(parsed.slides));
                    dispatch(setSelection(parsed.selection));
                } catch (error) {
                    console.error("Ошибка при парсинге файла:", error);
                    alert("Неверный формат презентации");
                }
            }
        };
        reader.readAsText(file);
    };

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

            <div>
                <label htmlFor="file-upload" className="upload-button">
                    Загрузить из JSON
                </label>
                <input
                    id="file-upload"
                    type="file"
                    accept=".json"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                />
            </div>

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
        </div>
    );
}
