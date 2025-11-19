import { createRoot } from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './store/store';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element not found');

const root = createRoot(rootEl);
root.render(
    <Provider store={store}>
        <App />
    </Provider>
);