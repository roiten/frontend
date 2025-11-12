import SlidePreview from "./SlidePreview.tsx";
import RoundButton from "../Common/Button/RoundButton/RoundButton.tsx";
import styles from "./Slidebar.module.css";
import { addSlide, removeSlides, chooseSlide } from "../../../store/actionCreators.ts";
import { useSlideMove } from "./hooks/useSlideMove.ts";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { Editor, Slide } from "../../../store/types.ts";
import { v4 as uuid } from "uuid";

export default function Slidebar() {
    const editor = useSelector((state: Editor) => state);
    const { slides } = editor;
    const dispatch = useDispatch();

    const [selectedSlidesIds, setSelectedSlidesIds] = useState<string[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    const {
        dropIndex,
        draggedSlidesIds,
        handleDragStart,
        handleDragOver,
        handleDrop,
    } = useSlideMove(selectedSlidesIds, setIsDragging);

    const slidebarTools = [
        {
            name: "Добавить новый слайд",
            icon: "/icons/plus.svg",
            action: () => {
                const newSlide: Slide = {
                    id: uuid(),
                    content: [],
                    background: { type: 'color', color: 'white' },
                };
                dispatch(addSlide(newSlide));
            },
        },
        {
            name: "Удалить слайд",
            icon: "/icons/trash-simple.svg",
            action: () => {
                if (selectedSlidesIds.length > 0) {
                    dispatch(removeSlides(selectedSlidesIds));
                    setSelectedSlidesIds([]);
                }
            },
        },
    ];

    const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            setSelectedSlidesIds([]);
        }
    };

    const handleSlideClick = (
        slideId: string,
        event: React.MouseEvent<HTMLDivElement>,
        index: number,
    ) => {
        const isCtrl = event.ctrlKey || event.metaKey;
        const isShift = event.shiftKey;

        if (isCtrl) {
            setSelectedSlidesIds((prev) =>
                prev.includes(slideId)
                    ? prev.filter((id) => id !== slideId)
                    : [...prev, slideId],
            );
        } else if (isShift && selectedSlidesIds.length > 0) {
            const lastSelectedIndex = slides.findIndex(
                (s) => s.id === selectedSlidesIds[selectedSlidesIds.length - 1],
            );
            const start = Math.min(lastSelectedIndex, index);
            const end = Math.max(lastSelectedIndex, index);
            const range = slides.slice(start, end + 1).map((s) => s.id);
            setSelectedSlidesIds(range);
        } else if (!isDragging) {
            setSelectedSlidesIds([slideId]);
            dispatch(chooseSlide(slideId));
        }
    };

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
                        onClick={() => tool.action?.()}
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
                                }}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}