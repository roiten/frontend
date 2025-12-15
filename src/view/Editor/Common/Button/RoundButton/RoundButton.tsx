import styles from "./RoundButton.module.css";
import type { Tool } from "../buttonTypes.ts";
import joinStyles from "../../../../../../utils/joinStyle.ts";

type RoundButtonProps = {
    tool: Tool;
    onClick: () => void;
    enabled: boolean;
};

export default function RoundButton({
    tool,
    onClick,
    enabled,
}: RoundButtonProps) {
    return (
        <span
            className={
                enabled
                    ? styles.tool
                    : joinStyles([styles.tool, styles.disabledTool])
            }
            onClick={enabled ? onClick : () => {}}
        >
            <img className={styles.icon} alt={tool.name} src={tool.icon} />
        </span>
    );
}
