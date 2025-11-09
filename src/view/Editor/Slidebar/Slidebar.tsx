import { slidebarTools } from "../Tools/toolsConfig.ts";
import SlidePreview from "./SlidePreview.tsx";
import RoundButton from "../Common/Button/RoundButton/RoundButton.tsx";
import styles from "./Slidebar.module.css";
import { dispatch, getEditor } from "../../../store/editor";
import { chooseSlide } from "../../../store/actions.ts";
import { useSlideMove } from "./hooks/useSlideMove.ts";
import { useState } from "react";

export default function Slidebar() {
    const editor = getEditor();
    const { slides } = editor;

    const [selectedSlidesIds, setSelectedSlidesIds] = useState<string[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    const {
        dropIndex,
        draggedSlidesIds,
        handleDragStart,
        handleDragOver,
        handleDrop,
    } = useSlideMove(selectedSlidesIds, setIsDragging);

    // Очистка выделения при клике вне слайдов (на пустое место)
    const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            setSelectedSlidesIds([]);
        }
    };

    // Обработка клика по слайду
    const handleSlideClick = (
        slideId: string,
        event: React.MouseEvent<HTMLDivElement>,
        index: number,
    ) => {
        const isCtrl = event.ctrlKey || event.metaKey;
        const isShift = event.shiftKey;

        if (isCtrl) {
            // Ctrl+Click — добавление/удаление из выделения
            setSelectedSlidesIds((prev) =>
                prev.includes(slideId)
                    ? prev.filter((id) => id !== slideId)
                    : [...prev, slideId],
            );
        } else if (isShift && selectedSlidesIds.length > 0) {
            // Shift+Click — выделение диапазона
            const lastSelectedIndex = slides.findIndex(
                (s) => s.id === selectedSlidesIds[selectedSlidesIds.length - 1],
            );
            const start = Math.min(lastSelectedIndex, index);
            const end = Math.max(lastSelectedIndex, index);
            const range = slides.slice(start, end + 1).map((s) => s.id);
            setSelectedSlidesIds(range);
        } else if (!isDragging) {
            // Обычный клик — выбор одного слайда
            setSelectedSlidesIds([slideId]);
            //необходимо не выбирать слайд пока пользователь не отпустит кнопку мыши (при перемещении слайда), как в powerpoint
            //ещё при выбранном слайде 1 (выделены 3 и 4), при попытке перемещения позиции, слайд 1 почему то тоже оказывается в числе двигаемых
            dispatch(chooseSlide, slideId);
        }
    };

    // Визуализация слайдов с учётом перетаскивания
    const visibleSlides = (() => {
        if (!isDragging || dropIndex === null || draggedSlidesIds.length === 0)
            return slides;

        const copy = [...slides];
        const selectedIndices = draggedSlidesIds
            .map((id) => copy.findIndex((s) => s.id === id))
            .filter((i) => i !== -1)
            .sort((a, b) => a - b);

        const selectedSlides = selectedIndices.map((i) => copy[i]);
        selectedIndices.reverse().forEach((i) => copy.splice(i, 1));
        copy.splice(dropIndex, 0, ...selectedSlides);

        return copy;
    })();

    return (
        <div className={styles.slidebar} onClick={handleBackgroundClick}>
            <div className={styles.slidebarTools}>
                {slidebarTools.map((tool) => (
                    <RoundButton
                        key={tool.name}
                        tool={tool}
                        onClick={() => tool.action?.(selectedSlidesIds)}
                    />
                ))}
            </div>

            <div className={styles.slidebarList}>
                {visibleSlides.map((slide, index) => {
                    const isSelected = selectedSlidesIds.includes(slide.id);
                    const isDragged = isDragging && draggedSlidesIds.includes(slide.id);

                    return (
                        <div
                            key={slide.id}
                            className={`${styles.slideWrapper} ${
                                isDragged ? styles.draggingSlide : ""
                            }`}
                            onMouseEnter={() => isDragging && handleDragOver(index)}
                            onMouseUp={handleDrop}
                        >
                            <SlidePreview
                                slide={slide}
                                isSelected={isSelected}
                                index={index}
                                onClick={(e) => handleSlideClick(slide.id, e, index)}
                                onMouseDown={() => {
                                    if (isSelected) {
                                        handleDragStart();
                                        setIsDragging(true);
                                    }
                                } }
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}