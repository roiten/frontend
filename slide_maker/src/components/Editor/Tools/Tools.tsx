import styles from './Tools.module.css';
import { editTools, saveTools } from '../../../constants/toolNames.ts';
import type { Tool } from '../../../constants/toolNames.ts';

const tools: Tool[] = [...saveTools, ...editTools];

export default function Tools() {
    const handleToolChoose = (tool: string) => {
        console.log('выбран инструмент:', tool);
    };

    return (
        <div className={styles.tools}>
            {tools.map((tool: Tool) => (
                <span
                    key={tool.name}
                    className={styles.tool}
                    onClick={() => handleToolChoose(tool.name)}
                >
                    <img
                        className={styles.toolIcon}
                        alt={tool.name}
                        src={tool.icon}
                    />
                    <span className={styles.toolName}>{tool.name}</span>
                </span>
            ))}
        </div>
    );
}
