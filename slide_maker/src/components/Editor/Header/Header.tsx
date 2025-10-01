import './Header.css';

type Props = {
    title: string;
};

export default function Header({ title }: Props) {
    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log('новое название: ', event.target.value);
    };

    return (
        <div className="editor__header">
            <input
                className="editor__title"
                type="text"
                defaultValue={title}
                onChange={handleTitleChange}
            />
        </div>
    );
}
