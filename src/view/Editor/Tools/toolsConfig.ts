import { dispatch } from "../../../store/editor.ts";
import { addSlide, removeSlide } from "../../../store/actions.ts";
import { handleAddText } from "./handlers/handleAddText.ts";
import { v4 as uuid } from "uuid";

export type Tool = {
    name: string;
    icon?: string;
    action?: (...args: any) => void;
};

export const saveTools: Tool[] = [
    { name: "Сохранить", icon: "/icons/floppy-disk.svg" },
];

export function createEditTools(
    onToolAction?: (toolName: string) => void,
): Tool[] {
    return [
        {
            name: "Новый текст",
            icon: "/icons/text-t.svg",
            action: () => handleAddText(),
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
    ];
}

export const slidebarTools: Tool[] = [
    {
        name: "Добавить новый слайд",
        icon: "/icons/plus.svg",
        action: () => {
            const newSlide = {
                id: uuid(),
                content: [],
                background: { color: 'white' },
            };
            dispatch(addSlide, newSlide);
        },
    },
    {
        name: "Удалить слайд",
        icon: "/icons/trash-simple.svg",
        action: (slideId: string) => {
            dispatch(removeSlide, slideId);
        },
    },
];
