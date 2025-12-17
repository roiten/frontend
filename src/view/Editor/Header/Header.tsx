import styles from "./Header.module.css";
import joinStyles from "../../../../utils/joinStyle.ts";
import { useDispatch } from "react-redux";
import {
    setPresentationId,
    setPresentationTitle,
} from "../../../store/reducers/presentationReducer.ts";
import { redo, undo } from "../../../store/reducers/undoableReducer.ts";
import * as appWrite from "../../../store/appWrite/api";
import { useAppSelector } from "../../../store/store.ts";
import { set as setSlides } from "../../../store/reducers/slidesReducer.ts";
import { set as setSelection } from "../../../store/reducers/selectionReducer.ts";
import { set as setPresentation } from "../../../store/reducers/presentationReducer.ts";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { createDefaultPresentation } from "../../../store/default.ts";
import { logout } from "../../../store/reducers/authReducer.ts";
import { useNavigate } from "react-router";

type HeaderProps = {
    onToolAction?: (toolName: string) => void;
};

export default function Header({ onToolAction }: HeaderProps) {
    const title = useAppSelector((state) => state.editor.present.meta.title);
    const canUndo = useAppSelector((state) => state.editor.past.length > 0);
    const canRedo = useAppSelector((state) => state.editor.future.length > 0);

    const present = useAppSelector((state) => state.editor.present);
    const presentationId = useAppSelector(
        (state) => state.editor.present.meta.presentationId,
    );

    const dispatch = useDispatch();
    const [isFileMenuOpen, setIsFileMenuOpen] = useState(false);
    const [user, setUser] =
        useState<Awaited<ReturnType<typeof appWrite.getCurrentUser>>>(null);
    const fileMenuRef = useRef<HTMLDivElement>(null);
    const fileButtonRef = useRef<HTMLButtonElement>(null);
    const [fileName, setFileName] = useState<string>("");
    const navigate = useNavigate();

    useEffect(() => {
        const loadUser = async () => {
            const currentUser = await appWrite.getCurrentUser();
            setUser(currentUser);
        };
        loadUser();
    }, []);

    const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
        dispatch(setPresentationTitle(event.target.value));
    };

    useEffect(() => {
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
        const newPresentation = createDefaultPresentation();
        newPresentation.present.meta.author = user?.name ?? "неизвестен";

        dispatch(setPresentation(newPresentation.present.meta));
        dispatch(setSlides(newPresentation.present.slides));
        dispatch(setSelection(newPresentation.present.selection));

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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] ?? null;
        if (selectedFile) {
            setFileName(selectedFile.name);
            readFileAsObject(selectedFile);
            e.target.value = "";
        }
    };

    const readFileAsObject = (file: File) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target?.result) {
                try {
                    const parsed = JSON.parse(event.target.result as string);
                    dispatch(setPresentation(parsed.meta));
                    dispatch(setSlides(parsed.slides));
                    dispatch(setSelection(parsed.selection));
                    setIsFileMenuOpen(false);
                } catch (error) {
                    console.error("Ошибка при чтении файла:", error);
                    setFileName("");
                }
            }
        };
        reader.readAsText(file);
    };

    const handleLoadPresentation = () => {
        const fileInput = document.getElementById(
            "file-upload",
        ) as HTMLInputElement;
        if (fileInput) {
            fileInput.click();
        }
        setIsFileMenuOpen(false);
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
                        <img
                            className={joinStyles([
                                styles.arrowIcon,
                                isFileMenuOpen ? styles.open : "",
                            ])}
                            src="./icons/menu-triangle.svg"
                            alt="открыть меню"
                        />
                    </button>

                    {isFileMenuOpen && (
                        <div
                            ref={fileMenuRef}
                            className={styles.fileMenuDropdown}
                        >
                            <button
                                className={styles.menuItem}
                                onClick={handleNewPresentation}
                            >
                                Новая презентация
                            </button>

                            <button
                                className={styles.menuItem}
                                onClick={handleOpen}
                            >
                                Открыть из облака
                            </button>

                            <button
                                onClick={handleLoadPresentation}
                                className={styles.menuItem}
                            >
                                {fileName
                                    ? `Загружено: ${fileName}`
                                    : "Загрузить презентацию"}
                            </button>

                            <input
                                id="file-upload"
                                type="file"
                                accept=".json"
                                onChange={handleFileChange}
                                style={{ display: "none" }}
                            />

                            <button
                                className={styles.menuItem}
                                onClick={handleSave}
                            >
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
                    placeholder="Название презентации"
                />
            </div>

            <span
                className={joinStyles([styles.logout, styles.right])}
                onClick={() => {
                    appWrite.deleteCurrentSession();
                    dispatch(logout());
                    navigate("/login");
                }}
            >
                Выйти
            </span>
        </div>
    );
}
