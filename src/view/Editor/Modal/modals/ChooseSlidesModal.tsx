import styles from "./ChooseSlidesModal.module.css";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../../../store/store.ts";
import * as appWrite from "../../../../store/appWrite/api";
import { set as setSlides } from "../../../../store/reducers/slidesReducer.ts";
import { set as setSelection } from "../../../../store/reducers/selectionReducer.ts";
import { set as setPresentation } from "../../../../store/reducers/presentationReducer.ts";
import SlideRenderer from "../../Slide/SlideRenderer.tsx";
import { validatePresentation } from "../../../../store/validateSlides.ts";
import { error } from "ajv/dist/vocabularies/applicator/dependencies";

type ChooseSlidesModalProps = {
    onClose: () => void;
};

export default function ChooseSlidesModal({ onClose }: ChooseSlidesModalProps) {
    const dispatch = useAppDispatch();
    const [userDocs, setUserDocs] = useState<any[]>([]);
    let status: boolean;

    useEffect(() => {
        const fetchUserDocs = async () => {
            const user = await appWrite.getCurrentUser();
            if (!user) {
                alert("Пользователь не авторизован.");
                return;
            }

            const docs = await appWrite.getPresentationDocumentsByUserId(
                user.$id,
            );
            setUserDocs(docs || []);
        };

        fetchUserDocs();
    }, []);

    const handleChooseSlide = async (docId: string) => {
        const doc = await appWrite.getPresentationDocumentById(docId);
        if (!doc) return;

        try {
            const parsed = JSON.parse(doc.content);
            status = validatePresentation(parsed);
            if (status) {
                console.log("Validate: OK");
                dispatch(setPresentation(parsed.meta));
                dispatch(setSlides(parsed.slides));
                dispatch(setSelection(parsed.selection));
                onClose();
            } else {
                alert("Презентация не может быть загружена. Данные повреждены");
                console.error(
                    "Ошибка при сверке обязательных полей презентации",
                );
            }
        } catch(e) {
            console.error("Ошибка при загрузке презентации", e);
        }
    };

    return (
        <div>
            <div className={styles.modalContent}>
                <div className={styles.slidesList}>
                    {userDocs.map((doc) => {
                        let parsedContent;
                        try {
                            parsedContent = JSON.parse(doc.content);
                        } catch {
                            return null;
                        }

                        const firstSlide = parsedContent.slides?.[0];

                        return (
                            <div
                                key={doc.$id}
                                className={styles.slideCard}
                                onClick={() => handleChooseSlide(doc.$id)}
                            >
                                {firstSlide ? (
                                    <div className={styles.slidePreview}>
                                        <SlideRenderer
                                            slide={firstSlide}
                                            scale={0.125}
                                            mode={"edit"}
                                        />
                                    </div>
                                ) : (
                                    <div className={styles.blankSlide}></div>
                                )}
                                <div className={styles.slideTitle}>
                                    {doc.title}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
