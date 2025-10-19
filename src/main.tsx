import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { getEditor, addEditorChangeHandler } from './store/editor';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element not found');

const root = createRoot(rootEl);

const render = () => {
    root.render(
        <StrictMode>
            <App editor={getEditor()} />
        </StrictMode>
    );
};

addEditorChangeHandler(render);
render();
