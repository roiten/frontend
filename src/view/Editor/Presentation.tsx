import { useDispatch } from "react-redux";
import styles from "./Editor.module.css";
import type { ModalType } from "../../store/types.ts";
import Header from "./Header/Header.tsx";
import Infobar from "./Infobar/Infobar.tsx";
import Slidebar from "./Slidebar/Slidebar.tsx";
import Tools from "./Tools/Tools.tsx";
import Workspace from "./Workspace/Workspace.tsx";
import { type JSX, useCallback, useState } from "react";
import Modal from "./Modal/Modal.tsx";
import BackgroundModal from "./Modal/modals/BackgroundModal.tsx";
import ImagePasteUrlModal from "./Modal/modals/ImagePasteUrlModal.tsx";
import {
    addSelectedObject,
    clearSelectedObjects,
    removeSelectedObject,
} from "../../store/reducers/selectionReducer.ts";
import * as React from "react";
import { useAppSelector, type AppDispatch } from "../../store/store";
import ChooseSlidesModal from "./Modal/modals/ChooseSlidesModal.tsx";
import { useUndoRedoHotkeys } from "./Common/Hooks/useHotkeys.ts";
import HistorySidePanel from "./HistorySidePanel/HistorySidePanel.tsx";

export default function Presentation(): JSX.Element {
    const dispatch = useDispatch<AppDispatch>();
    const showHistorySidePanel = useAppSelector((state) => state.ui.showHistoryPanel);

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentModal, setCurrentModal] = useState<ModalType>(null);

    function openModal(modalType: ModalType) {
        setCurrentModal(modalType);
        setModalIsOpen(true);
    }

    function closeModal() {
        setModalIsOpen(false);
        setCurrentModal(null);
    }

    function handleToolAction(toolName: string) {
        switch (toolName) {
            case "background":
                openModal("background-color");
                break;
            case "image-url":
                openModal("image-url");
                break;
            case "slides-list":
                openModal("slides-list");
                break;
            default:
                console.warn(toolName, "действие не назначено");
        }
    }

    function getModalContent() {
        switch (currentModal) {
            case "background-color":
                return <BackgroundModal onClose={closeModal} />;
            case "image-url":
                return <ImagePasteUrlModal onClose={closeModal} />;
            case "slides-list":
                return <ChooseSlidesModal onClose={closeModal} />;
            default:
                return null;
        }
    }

    function getModalTitle() {
        switch (currentModal) {
            case "background-color":
                return "Выберите цвет фона";
            case "image-url":
                return "Введите URL вставляемого изображения";
            case "slides-list":
                return "Выберите презентацию";
            default:
                return "";
        }
    }

    const handleSelectObject = useCallback(
        (objectId: string, isSelected: boolean) => {
            if (isSelected) {
                dispatch(addSelectedObject(objectId));
            } else {
                dispatch(removeSelectedObject(objectId));
            }
        },
        [],
    );

    const handleClearSelection = useCallback(
        (e: React.MouseEvent) => {
            if (e.target === e.currentTarget) {
                e.stopPropagation();
                dispatch(clearSelectedObjects());
            }
        },
        [],
    );

    useUndoRedoHotkeys();

    return (
        <div className={styles.app}>
            <div className={styles.editor}>
                <Header onToolAction={handleToolAction} />
                <Tools onToolAction={handleToolAction} />

                <div className={styles.main}>
                    <Slidebar />
                    <Workspace
                        onSelectObject={handleSelectObject}
                        onClearSelection={handleClearSelection}
                    />
                    {showHistorySidePanel && <HistorySidePanel />}
                </div>
                <Infobar />

                <Modal
                    isOpen={modalIsOpen}
                    onClose={closeModal}
                    title={getModalTitle()}
                >
                    {getModalContent()}
                </Modal>
            </div>
        </div>
    );
}
