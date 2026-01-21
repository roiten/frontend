import { useEffect, useState, useRef } from "react";
import SlideRenderer from "../Editor/Slide/SlideRenderer";
import styles from "./SpeakerView.module.css";
import type { Slide } from "../../store/types";
import { WindowMessage } from "../../store/windowMessageTypes";

export default function SpeakerView() {
    const [slides, setSlides] = useState<Slide[]>([]);
    const [slideIndex, setSlideIndex] = useState(0);
    const [elapsedTime, setElapsedTime] = useState(0);
    const timerRef = useRef<number | undefined>(undefined);
    const startTimeRef = useRef<number>(Date.now());
    const currentOrigin = window.location.origin;

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data.type === WindowMessage.INITIAL_DATA) {
                setSlides(event.data.slides || []);
            }
        };

        window.addEventListener("message", handleMessage);

        const timeout = setTimeout(() => {
            if (window.opener) {
                window.opener.postMessage(
                    { type: WindowMessage.SPEAKER_READY },
                    currentOrigin,
                );
            }
        }, 50);

        return () => {
            window.removeEventListener("message", handleMessage);
            clearTimeout(timeout);
        };
    }, []);

    useEffect(() => {
        startTimeRef.current = Date.now();

        timerRef.current = setInterval(() => {
            const elapsedSeconds = Math.floor(
                (Date.now() - startTimeRef.current) / 1000,
            );
            setElapsedTime(elapsedSeconds);
        }, 1000);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    const changeSlide = (newIndex: number) => {
        setSlideIndex(newIndex);

        if (window.opener) {
            window.opener.postMessage(
                {
                    type: WindowMessage.SET_SLIDE_INDEX,
                    index: newIndex,
                },
                currentOrigin,
            );
        }
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "ArrowLeft") {
                event.preventDefault();
                const newIndex = Math.max(0, slideIndex - 1);
                changeSlide(newIndex);
            } else if (event.key === "ArrowRight") {
                event.preventDefault();
                const newIndex = Math.min(slides.length - 1, slideIndex + 1);
                changeSlide(newIndex);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [slides.length, slideIndex]);

    if (slides.length === 0) {
        return <div>Ожидание данных от основного окна...</div>;
    }

    const currentNote = slides[slideIndex].note || "";

    const prevSlideIndex = Math.max(0, slideIndex - 1);
    const nextSlideIndex = Math.min(slides.length - 1, slideIndex + 1);

    const shouldShowPrevSlide = () => {
        if (prevSlideIndex == slideIndex) return false;
        return true;
    };

    const shouldShowNextSlide = () => {
        if (nextSlideIndex == slideIndex) return false;
        return true;
    };

    if (!slides[0]) {
        return <div className={styles.container}>Нет слайдов для показа</div>;
    }

    const formatTime = (seconds: number) => {
        const date = new Date(0);
        date.setSeconds(seconds);

        return seconds >= 3600
            ? date.toISOString().substr(11, 8)
            : date.toISOString().substr(14, 5);
    };

    if (!slides[0]) {
        return <div className={styles.container}>Нет слайдов для показа</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.timer}>
                <div className={styles.timerLabel}>Время доклада:</div>
                <div className={styles.timerValue}>
                    {formatTime(elapsedTime)}
                </div>
            </div>

            <div className={styles.slidesPanel}>
                <div className={`${styles.slidePreview} ${styles.prevSlide}`}>
                    <div className={styles.previewLabel}>Предыдущий</div>
                    <div className={styles.previewContent}>
                        {shouldShowPrevSlide() && (
                            <SlideRenderer
                                slide={slides[prevSlideIndex]}
                                scale={0.15}
                                mode="slideshow"
                            />
                        )}
                    </div>
                </div>

                <div
                    className={`${styles.slidePreview} ${styles.currentSlide}`}
                >
                    <div className={styles.previewLabel}>Текущий</div>
                    <div className={styles.previewContent}>
                        <SlideRenderer
                            slide={slides[slideIndex]}
                            scale={0.2}
                            mode="slideshow"
                        />
                    </div>
                    <div className={styles.slideCounter}>
                        {slideIndex + 1} / {slides.length}
                    </div>
                </div>

                <div className={`${styles.slidePreview} ${styles.nextSlide}`}>
                    <div className={styles.previewLabel}>Следующий</div>
                    <div className={styles.previewContent}>
                        {shouldShowNextSlide() && (
                            <SlideRenderer
                                slide={slides[nextSlideIndex]}
                                scale={0.15}
                                mode="slideshow"
                            />
                        )}
                    </div>
                </div>
            </div>

            <div className={styles.notesPanel}>
                <div className={styles.notesHeader}>Заметки докладчика</div>
                <div className={styles.notesContent}>
                    {currentNote || "Нет заметок для этого слайда"}
                </div>
            </div>
        </div>
    );
}
