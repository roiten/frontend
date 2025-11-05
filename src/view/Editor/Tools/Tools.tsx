import styles from "./Tools.module.css";
import { createEditTools } from "./toolsConfig.ts";
import type { Tool } from "./toolsConfig.ts";
import { handleEditFontSize } from "./handlers/handleEditFontSize.ts";
import { handleEditFontColor } from "./handlers/handleEditFontColor.ts";
import { handleEditFontFamily } from "./handlers/handleEditFontFamily.ts";
import { getTextObjectById, openPresentation } from "../../../store/actions.ts";
import { dispatch } from "../../../store/editor.ts";
import { useEffect, useState } from "react";
import type { Editor } from "../../../store/types.ts";
import SquareButton from "../Common/Button/SquareButton/SquareButton.tsx";

type ToolsProps = {
    selectedObjects: string[] | null;
    onToolAction?: (toolName: string) => void;
    editor: Editor;
};

function getSelectionInfo(selectedObjectIds: string[], editor: Editor) {
    const hasSelection = selectedObjectIds.length > 0;
    const textObjects = selectedObjectIds.map((id) =>
        getTextObjectById(editor, id),
    );
    const hasNoText = textObjects.some((obj) => obj === null);
    const allAreText = hasSelection && !hasNoText;
    return { textObjects, allAreText };
}

export default function Tools({ selectedObjects, onToolAction, editor }: ToolsProps) {

    const [, setFile] = useState<File | null>(null);

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
                    const fileContent = JSON.parse(event.target.result as string);
                    processPresentationData(fileContent);
                } catch (error) {
                    console.error('Ошибка при парсинге файла:', error);
                }
            }
        };
        reader.readAsText(file);
    };

    const processPresentationData = (data: Editor) => {
        console.log('Загруженные данные презентации:', data);
        dispatch(openPresentation, data)
    };

    const editTools = createEditTools(onToolAction);
    const tools: Tool[] = [...editTools];

    const selectedObjectIds = selectedObjects || [];
    const [tempFontSize, setTempFontSize] = useState<string>("");

    useEffect(() => {
        const { textObjects, allAreText } = getSelectionInfo(
            selectedObjectIds,
            editor,
        );
        if (allAreText && textObjects.length === 1) {
            setTempFontSize(String(textObjects[0]!.font.size));
        } else {
            setTempFontSize("");
        }
    }, [selectedObjectIds, editor]);

    const { textObjects, allAreText } = getSelectionInfo(
        selectedObjectIds,
        editor,
    );

    const fontFamily =
        allAreText && textObjects.length === 1
            ? textObjects[0]!.font.family
            : "";

    return (
        <div className={styles.tools}>
            {tools.map((tool: Tool) => (
                <SquareButton
                    key={tool.name}
                    tool={tool}
                    onClick={() => {
                        if (tool.action) {
                            tool.action();
                        }
                    }}
                />
            ))}
            <div>
                <label htmlFor="file-upload" className="upload-button">
                    Загрузить презентацию
                </label>
                <input
                    id="file-upload"
                    type="file"
                    accept=".json"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
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
                    <option></option>
                    <option value="Times New Roman">Serif</option>
                    <option value="Segoe UI">Segoe UI</option>
                    <option value="Comic Sans MS">Comic Sans MS</option>
                    <option value="Calibri">Calibri</option>
                    <option value="Arial">Arial</option>
                </select>
            </form>

            <input
                type="number"
                disabled={!allAreText}
                value={tempFontSize}
                onChange={(e) => {
                    const input = e.currentTarget.value;
                    setTempFontSize(input);

                    if (input === "") {
                        return;
                    }
                    const value = Number(input);
                    if (allAreText && !isNaN(value) && value > 0) {
                        handleEditFontSize(selectedObjectIds, value);
                    }
                }}
            />

            <input
                type="color"
                disabled={!allAreText}
                onChange={(e) => {
                    if (allAreText) {
                        handleEditFontColor(
                            selectedObjectIds,
                            e.currentTarget.value,
                        );
                    }
                }}
            />
        </div>
    );
}
