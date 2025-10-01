import './Infobar.css';

type Props = {
    author: string;
    createdAt: Date;
    editedAt: Date;
};

export default function Infobar({ author, createdAt, editedAt }: Props) {
    return (
        <div className="editor__infobar">
            <span>Автор: {author}</span>
            <span>Создано: {createdAt.toString()}</span>
            <span>Изменено: {editedAt.toString()}</span>
        </div>
    );
}
