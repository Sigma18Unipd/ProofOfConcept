import {
  ReactFlow,
  Controls,
  Background,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Node,
  type Edge,
} from '@xyflow/react';
import { useCallback, useState } from 'react';
import '@xyflow/react/dist/style.css';
import { SimpleNode } from './simpleNode';

const nodeTypes = { simpleNode: SimpleNode };

const initialNodes: Node[] = [
  {
    id: 'node-1',
    type: 'simpleNode',
    position: { x: 0, y: 0 },
    data: { value: 'Nodo1' },
  },
  {
    id: 'node-2',
    type: 'simpleNode',
    position: { x: 400, y: 0 },
    data: { value: 'SONO SHADCN' },
  },
  {
    id: 'node-3',
    type: 'simpleNode',
    position: { x: 400, y: 200 },
    data: { value: 'Nodo3' },
  },
];

const initialEdges: Edge[] = [
  {
    id: 'edge-1',
    source: 'node-1',
    target: 'node-2',
  },
];

export function EditorContainer() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const onNodesChange = useCallback(changes => setNodes(nds => applyNodeChanges(changes, nds)), [setNodes]);
  const onEdgesChange = useCallback(changes => setEdges(eds => applyEdgeChanges(changes, eds)), [setEdges]);
  const onConnect = useCallback(connection => setEdges(eds => addEdge(connection, eds)), [setEdges]);
  return (
    <div
      style={{
        gridArea: 'editorContainer',
      }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView>
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}
