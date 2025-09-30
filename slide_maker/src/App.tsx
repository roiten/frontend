import './App.css';
import PresentationComponent from './components/Presentation';
import { minimalTest, maxTest } from './components/tests.ts';

import type { Presentation as PresentationType, Text, Slide } from './components/types.ts';

function App() {
    let presentation: PresentationType = maxTest();

    return (
        <div className="App">
            <PresentationComponent presentation={presentation} />
        </div>
    );
}

export default App;
