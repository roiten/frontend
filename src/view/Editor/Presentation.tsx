import styles from "./Editor.module.css";
import { useState } from "react";
import type { Editor, ModalType } from "../../store/types.ts";

import Header from "./Header/Header.tsx";
import Infobar from "./Infobar/Infobar.tsx";
import Slidebar from "./Slidebar/Slidebar.tsx";
import Tools from "./Tools/Tools.tsx";
import Workspace from "./Workspace/Workspace.tsx";
import { type JSX } from "react";
import Modal from "./Modal/Modal.tsx";
import BackgroundModal from "./Modal/modals/BackgroundModal.tsx";
import ImagePasteUrlModal from "./Modal/modals/ImagePasteUrlModal.tsx";
import {
    handleClearSelection,
    handleSelectObject,
} from "./Workspace/handlers/handleSelectObject.ts";

type PresentationProps = {
    editor: Editor;
};

export default function Presentation({
    editor,
}: PresentationProps): JSX.Element {
    const currentSlide = editor.slides.find(
        (s) => s.id === editor.currentSlide,
    );
    const selectedObjects = editor.selectedObjects;

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
            default:
                console.log(
                    "Выбран инструмент:",
                    toolName,
                    "действие не назначено",
                );
        }
    }

    function getModalContent() {
        switch (currentModal) {
            case "background-color":
                return (
                    <BackgroundModal
                        slideId={editor.currentSlide}
                        onClose={closeModal}
                    />
                );
            case "image-url":
                return (
                    <ImagePasteUrlModal
                        slideId={editor.currentSlide}
                        onClose={closeModal}
                    />
                );
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
            default:
                return "";
        }
    }

    return (
        <div className={styles.editor}>
            <Header title={editor.title} />
            <Tools
                selectedObjects={selectedObjects}
                onToolAction={handleToolAction}
                editor={editor}
            />

            <div className={styles.main}>
                <Slidebar
                    currentSlideId={editor.currentSlide}
                />
                <Workspace
                    slide={currentSlide}
                    selectedObjects={selectedObjects}
                    onSelectObject={handleSelectObject}
                    onClearSelection={handleClearSelection}
                />
            </div>

            <Infobar
                author={editor.author}
                createdAt={editor.createdAt}
                editedAt={editor.editedAt}
            />

            <Modal
                isOpen={modalIsOpen}
                onClose={closeModal}
                title={getModalTitle()}
            >
                {getModalContent()}
            </Modal>
        </div>
    );
}
