import { EditorContainer } from './editorContainer';
import { TopContainer } from './topContainer';

export default function Edit() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gridTemplateRows: '80px 1fr',
        gridTemplateAreas: '"topContainer" "editorContainer"',
        height: '100vh',
      }}>
      <TopContainer />
      <EditorContainer />
    </div>
  );
}
