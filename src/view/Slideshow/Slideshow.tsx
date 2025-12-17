import { useEffect, useState } from "react";
import { useAppSelector } from "../../store/store";
import SlideRenderer from "../Editor/Slide/SlideRenderer";
import { SLIDE_HEIGHT } from "../../store/default.ts";
import styles from "./Slideshow.module.css";

export default function Slideshow() {
    const slides = useAppSelector((state) => state.editor.present.slides);
    const [slideIndex, setSlideIndex] = useState(0);

    const nextSlide = () => {
        if (slideIndex < slides.length - 1) {
            setSlideIndex(slideIndex + 1);
        }
    };

    const prevSlide = () => {
        if (slideIndex > 0) {
            setSlideIndex(slideIndex - 1);
        }
    };

    const [scale, setScale] = useState(1);

    useEffect(() => {
        const updateScale = () => {
            setScale((window.innerHeight / SLIDE_HEIGHT) * 0.95);
        };

        updateScale();
        window.addEventListener("resize", updateScale);
        return () => window.removeEventListener("resize", updateScale);
    }, []);
    
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "ArrowLeft") {
                event.preventDefault();
                // только если не первый слайд
                if (slideIndex > 0) {
                    setSlideIndex(slideIndex - 1);
                }
            } else if (event.key === "ArrowRight") {
                event.preventDefault();
                // только если не последний слайд
                if (slideIndex < slides.length - 1) {
                    setSlideIndex(slideIndex + 1);
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [slideIndex, slides.length]);

    if (!slides[0]) return <div>Нет первого слайда</div>;

    return (
        <>
            <div className={styles.slideWrapper}>
                <SlideRenderer
                    slide={slides[slideIndex]}
                    scale={scale}
                    mode="slideshow"
                />
            </div>
        </>
    );
}
