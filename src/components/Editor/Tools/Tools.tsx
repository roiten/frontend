import styles from './Tools.module.css';
import { editTools, saveTools } from '../../../lib/editor/tools.ts';
import type { Tool } from '../../../lib/editor/tools.ts';
import { handleEditFontSize } from '../../../lib/editor/handlers/handleEditFontSize.ts';
import { handleEditFontColor } from '../../../lib/editor/handlers/handleEditFontColor.ts';
import { handleEditFontFamily } from '../../../lib/editor/handlers/handleEditFontFamily.ts';

const tools: Tool[] = [...saveTools, ...editTools];

type ToolsProps = {
    selectedObjects: string[] | null;
};

export default function Tools({ selectedObjects }: ToolsProps) {
    const selectedObjectIds = selectedObjects || [];

    const handleToolChoose = (tool: string) => {
        console.log('выбран инструмент:', tool);
    };

    const hasSelection = selectedObjectIds.length > 0;

    return (
        <div className={styles.tools}>
            {tools.map((tool: Tool) => (
                <span
                    key={tool.name}
                    className={styles.tool}
                    onClick={() => {
                        if (tool.action) {
                            tool.action();
                        } else {
                            handleToolChoose(tool.name);
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
                    disabled={!hasSelection}
                    onChange={e => {
                        const fontFamily = e.currentTarget.value;
                        if (hasSelection) {
                            handleEditFontFamily(selectedObjectIds, fontFamily);
                        }
                    }}
                >
                    <option value="Segoe UI">Segoe UI</option>
                    <option value="Times New Roman">Serif</option>
                    <option value="Comic Sans MS">Comic Sans MS</option>
                    <option value="Calibri">Calibri</option>
                    <option value="Arial">Arial</option>
                </select>
            </form>

            <input
                type="number"
                disabled={!hasSelection}
                onChange={e => {
                    const value = Number(e.currentTarget.value);
                    if (hasSelection) {
                        handleEditFontSize(selectedObjectIds, value);
                    }
                }}
            />

            <input
                type="color"
                disabled={!hasSelection}
                onChange={e => {
                    const value = e.currentTarget.value;
                    if (hasSelection) {
                        handleEditFontColor(selectedObjectIds, value);
                    }
                }}
            />
        </div>
    );
}
