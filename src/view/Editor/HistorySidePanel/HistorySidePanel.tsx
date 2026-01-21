import { useState, useEffect } from "react";
import * as appWrite from "../../../store/appWrite/api";
import styles from "./HistorySidePanel.module.css";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { set as setSlides } from "../../../store/reducers/slidesReducer.ts";
import { set as setPresentation } from "../../../store/reducers/presentationReducer.ts";
import { setActivePresentationVersoinId } from "../../../store/reducers/uiReducer.ts";

interface VersionData {
    id: string;
    title: string;
    date: Date;
    isCurrent?: boolean;
    author?: string;
    versionNumber?: number;
}

export default function HistorySidePanel() {
    const dispatch = useAppDispatch();
    const [userDocs, setUserDocs] = useState<any[]>([]);
    const [versions, setVersions] = useState<VersionData[]>([]);
    const presentationId = useAppSelector(
        (state) => state.editor.present.meta.presentationId,
    );
    const versionId = useAppSelector(
        (state) => state.ui.activePresentationVersoinId,
    );

    useEffect(() => {
        const fetchUserDocs = async () => {
            const user = await appWrite.getCurrentUser();
            if (!user) {
                alert("Пользователь не авторизован.");
                return;
            }

            const docs = await appWrite.getDocumentVersionsByUserId(
                presentationId,
                user.$id,
            );
            setUserDocs(docs || []);

            if (docs && docs.length > 0) {
                const versionList: VersionData[] = docs.map((doc, index) => {
                    let parsedContent;
                    try {
                        parsedContent = JSON.parse(doc.content);
                    } catch {
                        parsedContent = {
                            meta: { title: "Безымянная версия" },
                        };
                    }

                    const date = new Date(doc.$createdAt);

                    return {
                        id: doc.$id || doc.id,
                        title:
                            parsedContent.meta.title || `Версия ${index + 1}`,
                        date: date,
                        isCurrent: index === 0,
                        author: "Вы",
                        versionNumber: index + 1,
                    };
                });

                setVersions(versionList);
            }
        };

        fetchUserDocs();
    }, []);

    const formatDate = (date: Date): string => {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return `Сегодня, ${date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}`;
        } else if (diffDays === 1) {
            return `Вчера, ${date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}`;
        } else if (diffDays < 7) {
            return `${diffDays} дней назад`;
        } else {
            return date.toLocaleDateString("ru-RU", {
                day: "numeric",
                month: "short",
                year:
                    date.getFullYear() !== now.getFullYear()
                        ? "numeric"
                        : undefined,
            });
        }
    };

    const handleVersionClick = (versionId: string) => {
        const loaded = userDocs.find((doc) => doc.$id === versionId);

        if (!loaded) {
            console.warn(`Версия ${versionId} не найдена в userDocs`);
            return;
        }

        try {
            const parsedContent = JSON.parse(loaded.content);

            if (!parsedContent.meta) {
                console.warn("Версия не содержит meta данных");
                parsedContent.meta = { title: "Безымянная версия" };
            }

            if (!parsedContent.slides) {
                console.warn("Версия не содержит слайдов");
                parsedContent.slides = [];
            }

            dispatch(setPresentation(parsedContent.meta));
            dispatch(setSlides(parsedContent.slides));
            dispatch(setActivePresentationVersoinId(versionId));

            console.log(
                `Версия "${parsedContent.meta.title}" успешно загружена`,
            );
        } catch (error) {
            console.error("Ошибка при загрузке версии:", error);
            alert("Не удалось загрузить версию. Возможно, файл поврежден.");
        }
    };

    return (
        <div className={styles.sidepanel}>
            <div className={styles.header}>
                <h2 className={styles.headerTitle}>История версий</h2>
                <p className={styles.headerSubtitle}>
                    {versions.length} сохраненных версий
                </p>
            </div>

            {versions.length > 0 ? (
                <div className={styles.versionList}>
                    {versions
                        .slice()
                        .reverse()
                        .map((version) => (
                            <div
                                key={version.id}
                                className={`${styles.versionItem} ${versionId === version.id ? styles.active : ""}`}
                                onClick={() => handleVersionClick(version.id)}
                            >
                                <div
                                    className={`${styles.versionIcon} ${versionId === version.id ? styles.current : ""}`}
                                >
                                    {version.versionNumber}
                                </div>
                                <div className={styles.versionContent}>
                                    <h3 className={styles.versionTitle}>
                                        {version.title}
                                        {version.id == versionId && (
                                            <span
                                                className={styles.currentBadge}
                                            >
                                                Текущая
                                            </span>
                                        )}
                                    </h3>
                                    <p className={styles.versionDate}>
                                        <span>{formatDate(version.date)}</span>
                                    </p>
                                    <p className={styles.versionAuthor}>
                                        {version.author}
                                    </p>
                                </div>
                            </div>
                        ))}
                </div>
            ) : (
                <div className={styles.emptyState}>
                    <div className={styles.emptyStateIcon}></div>
                    <h3 className={styles.emptyStateTitle}>
                        Нет сохраненных версий
                    </h3>
                    <p className={styles.emptyStateSubtitle}>
                        Сохраните презентацию, чтобы увидеть ее историю
                        изменений
                    </p>
                </div>
            )}
        </div>
    );
}
