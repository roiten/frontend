import PresentationComponent from "./components/Editor/Presentation.tsx";

import type { Editor } from "./store/types.ts";
type AppProps = {
    editor: Editor;
};
function App({ editor }: AppProps) {
    return <PresentationComponent editor={editor} />;
}

export default App;
