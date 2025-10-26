import styles from "./Tools.module.css";
import { createEditTools, saveTools } from "./toolsConfig.ts";
import type { Tool } from "./toolsConfig.ts";
import { handleEditFontSize } from "./handlers/handleEditFontSize.ts";
import { handleEditFontColor } from "./handlers/handleEditFontColor.ts";
import { handleEditFontFamily } from "./handlers/handleEditFontFamily.ts";
import { getTextObjectById } from "../../../store/actions.ts";
import { getEditor } from "../../../store/editor.ts";
import { useEffect, useState } from "react";
import type { Editor } from "../../../store/types.ts";

type ToolsProps = {
    selectedObjects: string[] | null;
    onToolAction?: (toolName: string) => void;
};

function getSelectionInfo(selectedObjectIds: string[], editor: Editor) {
    const hasSelection = selectedObjectIds.length > 0;
    const textObjects = selectedObjectIds.map(id => getTextObjectById(editor, id));
    const hasNoText = textObjects.some(obj => obj === null);
    const allAreText = hasSelection && !hasNoText;
    return { textObjects, allAreText };
}
export default function Tools({ selectedObjects, onToolAction }: ToolsProps) {
    const editTools = createEditTools(onToolAction);
    const tools: Tool[] = [...saveTools, ...editTools];

    const editor = getEditor();
    const selectedObjectIds = selectedObjects || [];
    const [tempFontSize, setTempFontSize] = useState<string>("");

    useEffect(() => {
        const editor = getEditor();
        const { textObjects, allAreText } = getSelectionInfo(selectedObjectIds, editor);
        if (allAreText && textObjects.length === 1) {
            setTempFontSize(String(textObjects[0]!.font.size));
        } else {
            setTempFontSize("");
        }
    }, [selectedObjectIds]);

    const { textObjects, allAreText } = getSelectionInfo(selectedObjectIds, editor);


    const fontFamily = allAreText && textObjects.length === 1
        ? textObjects[0]!.font.family
        : "";

    return (
        <div className={styles.tools}>
            {tools.map((tool: Tool) => (
                <span
                    key={tool.name}
                    className={styles.tool}
                    onClick={() => {
                        if (tool.action) {
                            tool.action();
                        }
                    }}
                >
                    <img
                        className={styles.toolIcon}
                        alt={tool.name}
                        src={tool.icon}
                    />
                    <span className={styles.toolName}>{tool.name}</span>
                </span>
            ))}
            <form>
                <select
                    name="font"
                    id="fontSelect"
                    disabled={!allAreText}
                    value={fontFamily}
                    onChange={(e) => {
                        if (allAreText) {
                            handleEditFontFamily(selectedObjectIds, e.currentTarget.value);
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
                        handleEditFontColor(selectedObjectIds, e.currentTarget.value);
                    }
                }}
            />
        </div>
    );
}
