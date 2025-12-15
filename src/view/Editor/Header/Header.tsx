import styles from "./Header.module.css";
import joinStyles from "../../../../utils/joinStyle.ts";
import * as React from "react";
import { useDispatch } from "react-redux";
import {
    setPresentationId,
    setPresentationTitle,
} from "../../../store/reducers/presentationReducer.ts";
import type { Editor } from "../../../store/types.ts";
import { redo, undo } from "../../../store/reducers/undoable.ts";
import * as appWrite from "../../../store/appWrite/api";
import { useAppSelector } from "../../../store/store.ts";
import { set as setSlides } from "../../../store/reducers/slidesReducer.ts";

type HeaderProps = {
    onClick?: () => void;
    onToolAction?: (toolName: string) => void;
};

export default function Header({ onClick, onToolAction }: HeaderProps) {
    const title = useAppSelector((state) => state.present.meta.title);
    const canUndo = useAppSelector((state) => state.past.length > 0);
    const canRedo = useAppSelector((state) => state.future.length > 0);
    const present = useAppSelector((state) => state.present);
    const presentationId = useAppSelector(
        (state) => state.present.meta.presentationId,
    );

    const dispatch = useDispatch();
    const [isFileMenuOpen, setIsFileMenuOpen] = React.useState(false);
    const [user, setUser] = React.useState<Awaited<ReturnType<typeof appWrite.getCurrentUser>>>(null);
    const fileMenuRef = React.useRef<HTMLDivElement>(null);
    const fileButtonRef = React.useRef<HTMLButtonElement>(null);

    React.useEffect(() => {
        const loadUser = async () => {
            const currentUser = await appWrite.getCurrentUser();
            setUser(currentUser);
        };
        loadUser();
    }, []);

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setPresentationTitle(event.target.value));
    };

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                fileMenuRef.current &&
                fileButtonRef.current &&
                !fileMenuRef.current.contains(event.target as Node) &&
                !fileButtonRef.current.contains(event.target as Node)
            ) {
                setIsFileMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleFileMenuClick = () => {
        setIsFileMenuOpen(!isFileMenuOpen);
    };

    const handleNewPresentation = async () => {
        console.log("Создание новой презентации");
        if (user) {
            try {
                const pres = await appWrite.createPresentationDocument(
                    user.$id,
                    present,
                );
                const newId = pres.document.$id;

                dispatch(setPresentationId(newId));
                setIsFileMenuOpen(false);
                console.log("Новая презентация создана:", newId);
            } catch (error) {
                console.error("Ошибка при создании презентации:", error);
            }
        } else {
            console.error(
                "Пользователь не авторизован. Создание презентации невозможно",
            );
        }
    };

    const handleOpen = () => {
        console.log("Открытие презентации");
        onToolAction?.("slides-list");
        setIsFileMenuOpen(false);
    };

    const handleSave = async () => {
        console.log("Сохранение презентации");
        if (presentationId) {
            try {
                const pres = await appWrite.updatePresentationDocument(
                    presentationId,
                    present,
                );
                dispatch(setSlides(pres.processedData.slides));
                console.log("Обновлено:", presentationId);
            } catch (err) {
                console.error("Ошибка обновления:", err);
            }
        }
        setIsFileMenuOpen(false);
    };

    const handleUndo = () => {
        dispatch(undo());
    };

    const handleRedo = () => {
        dispatch(redo());
    };

    return (
        <div className={styles.header}>
            <div className={styles.left}>
                <img
                    src={"./icons/siteIcon.png"}
                    alt={"логотип слайдмейкера"}
                    className={joinStyles([styles.siteLogo])}
                />

                <div className={styles.fileMenuContainer}>
                    <button
                        ref={fileButtonRef}
                        className={styles.fileMenuButton}
                        onClick={handleFileMenuClick}
                        aria-expanded={isFileMenuOpen}
                        aria-haspopup="true"
                    >
                        Файл
                        <svg 
                            className={`${styles.arrowIcon} ${isFileMenuOpen ? styles.open : ''}`}
                            viewBox="0 0 12 12" 
                        >
                            <path 
                                d="M6 9L2 5h8L6 9z" 
                                fill="currentColor"
                            />
                        </svg>
                    </button>

                    {isFileMenuOpen && (
                        <div
                            ref={fileMenuRef}
                            className={styles.fileMenuDropdown}
                            role="menu"
                            aria-labelledby="file-menu-button"
                        >
                            <button
                                className={styles.menuItem}
                                onClick={handleNewPresentation}
                                role="menuitem"
                            >
                                <img 
                                    src="./icons/file-add.svg" 
                                    alt=""
                                    className={styles.menuItemIcon}
                                />
                                Новая презентация
                            </button>

                            <button
                                className={styles.menuItem}
                                onClick={handleOpen}
                                role="menuitem"
                            >
                                <img 
                                    src="./icons/folder-open.svg" 
                                    alt=""
                                    className={styles.menuItemIcon}
                                />
                                Открыть из облака
                            </button>
                            <button
                                className={styles.menuItem}
                                onClick={handleSave}
                                role="menuitem"
                            >
                                <img 
                                    src="./icons/save.svg" 
                                    alt=""
                                    className={styles.menuItemIcon}
                                />
                                Сохранить
                            </button>
                        </div>
                    )}
                </div>

                <div className={styles.undoRedoContainer}>
                    <button
                        className={styles.undoRedoButton}
                        onClick={handleUndo}
                        disabled={!canUndo}
                        title="Отменить"
                    >
                        <img
                            src="./icons/arrow-left.svg"
                            alt="Отменить"
                            width="16"
                            height="16"
                        />
                    </button>

                    <button
                        className={styles.undoRedoButton}
                        onClick={handleRedo}
                        disabled={!canRedo}
                        title="Повторить"
                    >
                        <img
                            src="./icons/arrow-right.svg"
                            alt="Повторить"
                            width="16"
                            height="16"
                        />
                    </button>
                </div>
            </div>

            <div className={styles.center}>
                <input
                    type="text"
                    className={styles.title}
                    value={title}
                    onChange={handleTitleChange}
                />
            </div>

            <span
                className={joinStyles([styles.logout, styles.right])}
                onClick={onClick}
            >
                Выйти
            </span>
        </div>
    );
}