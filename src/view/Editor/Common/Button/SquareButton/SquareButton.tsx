import styles from "./SquareButton.module.css";
import type { Tool } from "../buttonTypes.ts";

type RoundButtonProps = {
    tool: Tool;
    onClick: () => void;
}

export default function SquareButton({tool, onClick}: RoundButtonProps) {
    return (
        <span
            className={styles.tool}
            onClick={onClick}
        >
            {tool?.icon && (
                <img
                    className={styles.icon}
                    alt={tool.name}
                    src={tool.icon}
                />
            )}
            <span className={styles.toolName}>{tool.name}</span>
        </span>
    )
}