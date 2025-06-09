import { useState } from 'react';
import { EditorContainer } from './editorContainer';
import { TopContainer } from './topContainer';
import { SimpleNode } from './simpleNode';
import {
  type Node,
  type Edge,
} from '@xyflow/react';



const nodeTypes = { simpleNode: SimpleNode };
const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];



export default function Edit() {
  const [currentNodes, setNodes] = useState<Node[]>(initialNodes);
  const [currentEdges, setEdges] = useState<Edge[]>(initialEdges);
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gridTemplateRows: '80px 1fr',
        gridTemplateAreas: '"topContainer" "editorContainer"',
        height: '100vh',
      }}>
      <TopContainer setNodes={setNodes} setEdges={setEdges} />
      <EditorContainer nodesList={currentNodes} edgesList={currentEdges} nodeTypes={nodeTypes} />
    </div>
  );
}
