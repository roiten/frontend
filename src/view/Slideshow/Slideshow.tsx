import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import SlideRenderer from "../Editor/Slide/SlideRenderer";
import { SLIDE_HEIGHT } from "../../store/default.ts";
import styles from "./Slideshow.module.css";
import { chooseSlide } from "../../store/reducers/selectionReducer.ts";
import { useNavigate } from "react-router";
import { WindowMessage } from "../../store/windowMessageTypes.ts";

type SlideshowProps = {
    isSpeakerMode: boolean;
};

export default function Slideshow({ isSpeakerMode }: SlideshowProps) {
    const dispatch = useAppDispatch();
    const slides = useAppSelector((state) => state.editor.present.slides);
    const [slideIndex, setSlideIndex] = useState(0);
    const [scale, setScale] = useState(1);
    const navigate = useNavigate();

    const findNextShowSlideIndex = (currentIndex: number): number | null => {
        let i = currentIndex + 1;
        while (i < slides.length) {
            if (!slides[i].hidden) return i;
            i++;
        }
        return null;
    };

    const findPrevShowSlideIndex = (currentIndex: number): number | null => {
        let i = currentIndex - 1;
        while (i >= 0) {
            if (!slides[i].hidden) return i;
            i--;
        }
        return null;
    };

    const nextSlide = () => {
        const nextIndex = findNextShowSlideIndex(slideIndex);
        if (nextIndex !== null) {
            setSlideIndex(nextIndex);
            dispatch(chooseSlide(slides[nextIndex].id));
        }
    };

    const prevSlide = () => {
        const prevIndex = findPrevShowSlideIndex(slideIndex);
        if (prevIndex !== null) {
            setSlideIndex(prevIndex);
            dispatch(chooseSlide(slides[prevIndex].id));
        }
    };

    useEffect(() => {
        if (!isSpeakerMode) {
            document.body.requestFullscreen().catch(() => {});
        }
    }, [isSpeakerMode]);

    useEffect(() => {
        const updateScale = () => {
            setScale(window.innerHeight / SLIDE_HEIGHT);
        };

        updateScale();

        window.addEventListener("resize", updateScale);

        return () => window.removeEventListener("resize", updateScale);
    }, []);

    useEffect(() => {
        const onFullscreenChange = () => {
            if (!document.fullscreenElement) {
                navigate("/editor");
            }
        };

        document.addEventListener("fullscreenchange", onFullscreenChange);

        return () =>
            document.removeEventListener(
                "fullscreenchange",

                onFullscreenChange,
            );
    }, []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "ArrowLeft") {
                event.preventDefault();
                prevSlide();
            } else if (event.key === "ArrowRight") {
                event.preventDefault();
                nextSlide();
            } else if (event.key === "Escape") {
                event.preventDefault();
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                }
                if (isSpeakerMode) {
                    navigate("/editor");
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isSpeakerMode, slideIndex, slides]);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data.type === WindowMessage.SET_SLIDE_INDEX) {
                const newIndex = event.data.index;
                setSlideIndex(newIndex);

                if (slides[newIndex]) {
                    dispatch(chooseSlide(slides[newIndex].id));
                }
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, [slides]);

    if (!slides[0]) return <div>Нет доступного слайда</div>;

    return (
        <div className={styles.slideWrapper}>
            <SlideRenderer
                slide={slides[slideIndex]}
                scale={scale}
                mode="slideshow"
            />
        </div>
    );
}
