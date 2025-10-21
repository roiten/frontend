import styles from './Modal.module.css';

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    width?: number;
    height?: number;
};

export default function Modal({
    isOpen,
    onClose,
    title,
    children,

}: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className={styles.modal} onClick={onClose}>
            <div
                className={styles.modalContent}
                onClick={e => e.stopPropagation()}
            >
                <div className={styles.modalHeader}>
                    <span className={styles.modalTitle}>{title}</span>
                    <span className={styles.closeButton} onClick={onClose}>
                        ×
                    </span>
                </div>
                <div>{children}</div>
            </div>
        </div>
    );
}
