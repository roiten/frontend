import './App.css';
import PresentationComponent from './components/Editor/Presentation.tsx';
import {
    // minimalTest,
    maxTest,
} from './tests/tests.ts';

import type { Presentation as PresentationType } from './models/types.ts';

function App() {
    const presentation: PresentationType = maxTest();

    return (
        <div className="App">
            <PresentationComponent presentation={presentation} />
        </div>
    );
}

export default App;
