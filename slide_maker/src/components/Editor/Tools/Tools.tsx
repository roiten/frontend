import {
    editTools,
    saveTools,
    // slidebarTools
} from '../../../constants/toolNames.ts';
import './Tools.css';

export default function Tools() {
    const handleToolChoose = (tool: string) => {
        console.log('выбран инструмент: ', tool);
    };

    return (
        <div className="editor__tools">
            <div className="tools__action">
                {saveTools.map((tool) => (
                    <span
                        key={tool.name}
                        className="tool"
                        onClick={() => handleToolChoose(tool.name)}
                    >
                        <img className={'tool__icon'} alt={tool.name} src={tool.icon} />
                        <span className="tool__name">{tool.name}</span>
                    </span>
                ))}
            </div>

            <div className="tools__action">
                {editTools.map((tool) => (
                    <span
                        key={tool.name}
                        className="tool"
                        onClick={() => handleToolChoose(tool.name)}
                    >
                        <img className={'tool__icon'} alt={tool.name} src={tool.icon} />
                        <span className="tool__name">{tool.name}</span>
                    </span>
                ))}
            </div>
        </div>
    );
}
