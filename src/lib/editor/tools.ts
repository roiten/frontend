import { dispatch } from '../../store/editor.ts';
import { addSlide, removeSlide } from '../../store/types.ts';
import { handleAddText } from './handlers/handleAddText.ts';
import { v4 as uuid } from 'uuid';

export type Tool = {
    name: string;
    icon?: string;
    action?: (...args: any[]) => void;
};

export const saveTools: Tool[] = [
    { name: 'Сохранить', icon: '/icons/floppy-disk.svg' },
    { name: 'в PDF', icon: '/icons/export.svg' },
    { name: 'История', icon: '/icons/clock-counter-clockwise.svg' },
];

export const editTools: Tool[] = [
    {
        name: 'Новый текст',
        icon: '/icons/text-t.svg',
        action: () => handleAddText(),
    },
    // {
    //     name: 'Шрифт',
    //     icon: '/icons/text-aa.svg',
    //     // action: () => ,
    // },
    // { name: 'Стиль шрифта', icon: '/icons/text-b.svg' },
    { name: 'Фон', icon: '/icons/wall.svg' },
    { name: 'Вставить', icon: '/icons/clipboard-text.svg' },
    { name: 'По образцу', icon: '/icons/paint-roller.svg' },
    // { name: 'Фигура', icon: '/icons/shapes.svg' },
    // { name: 'Таблица', icon: '/icons/grid-nine.svg' },
    // { name: 'Список', icon: '/icons/list-bullets.svg' },
    // { name: 'Отступы', icon: '/icons/text-indent.svg' },
];

export const slidebarTools: Tool[] = [
    {
        name: 'Добавить новый слайд',
        icon: '/icons/plus.svg',
        action: () => {
            const newSlide = {
                id: uuid(),
                content: [],
                background: { color: '#fff' },
            };
            dispatch(addSlide, newSlide);
        },
    },
    {
        name: 'Удалить слайд',
        icon: '/icons/trash-simple.svg',
        action: (slideId: string) => {
            dispatch(removeSlide, slideId);
        },
    },
    // {
    //     name: 'Применить форматирование к слайду',
    //     icon: '/icons/paint-roller.svg',
    // },
    // { name: 'Выбрать', icon: '/icons/selection-all.svg' },
];
