import styles from "./ChooseSlidesModal.module.css";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../../../store/store.ts";
import * as appWrite from "../../../../store/appWrite/api";
import { set as setSlides } from "../../../../store/reducers/slidesReducer.ts";
import { set as setSelection } from "../../../../store/reducers/selectionReducer.ts";
import { set as setPresentation } from "../../../../store/reducers/presentationReducer.ts";
import SlideRenderer from "../../Slide/SlideRenderer.tsx";

type ChooseSlidesModalProps = {
    onClose: () => void;
};

export default function ChooseSlidesModal({ onClose }: ChooseSlidesModalProps) {
    const dispatch = useAppDispatch();
    const [userDocs, setUserDocs] = useState<any[]>([]);

    useEffect(() => {
        const fetchUserDocs = async () => {
            const user = await appWrite.getCurrentUser();
            if (!user) {
                alert("Пользователь не авторизован.");
                return;
            }

            const docs = await appWrite.getPresentationDocumentsByUserId(user.$id);
            setUserDocs(docs || []);
        };

        fetchUserDocs();
    }, []);

    const handleChooseSlide = async (docId: string) => {
        const doc = await appWrite.getPresentationDocumentById(docId);
        if (!doc) return;

        try {
            const parsed = JSON.parse(doc.content);
            dispatch(setPresentation(parsed.meta));
            dispatch(setSlides(parsed.slides));
            dispatch(setSelection(parsed.selection));
            onClose();
        } catch {
            alert("Ошибка при загрузке презентации");
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
                            <div key={doc.$id} className={styles.slideCard} onClick={() => handleChooseSlide(doc.$id)}>
                                {firstSlide && (
                                    <div className={styles.slidePreview}>
                                        <SlideRenderer slide={firstSlide} scale={0.125} />
                                    </div>
                                )}
                                <div className={styles.slideTitle}>{doc.title}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
