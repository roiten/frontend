import styles from "./RoundButton.module.css";
import type { Tool } from "../buttonTypes.ts";

type RoundButtonProps = {
    tool: Tool;
    onClick: () => void;
}

export default function RoundButton({tool, onClick}: RoundButtonProps) {
    return (
        <span
            className={styles.tool}
            onClick={onClick}
        >
            <img
                className={styles.icon}
                alt={tool.name}
                src={tool.icon}
            />
        </span>
    )
}