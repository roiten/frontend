import styles from "./SquareButton.module.css";
import type { Tool } from "../buttonTypes.ts";
import joinStyles from "../../../../../../utils/joinStyle.ts";

type RoundButtonProps = {
    tool: Tool;
    onClick: () => void;
}

export default function SquareButton({tool, onClick}: RoundButtonProps) {
    return (
        <span
            className={tool.name == "" ? styles.tool : joinStyles([styles.tool, styles.toolGap])}
            onClick={onClick}
        >
            {tool?.icon && (
                <img
                    className={styles.icon}
                    alt={tool.name}
                    src={tool.icon}
                />
            )}
            <span className={styles.toolName}>{tool.name != "" && tool.name}</span>
        </span>
    )
}