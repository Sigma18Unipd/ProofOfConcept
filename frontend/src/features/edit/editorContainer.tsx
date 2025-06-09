import {
  ReactFlow,
  Controls,
  Background,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
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
    data: { title: 'Nodo1', apiKey: 'ASD)_(#*()#$%&'},
  },
  {
    id: 'node-2',
    type: 'simpleNode',
    position: { x: 400, y: 0 },
    data: { title: 'Nodo2', apiKey: 'OPENAI_API_KEY'},
  },
  {
    id: 'node-3',
    type: 'simpleNode',
    position: { x: 400, y: 200 },
    data: { title: 'Nodo3', apiKey: 'ANOTHER_PIETROCROTTIAI_KEY' },
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
  const onNodesChange = useCallback((changes: NodeChange<Node>[]) => setNodes(nds => applyNodeChanges(changes, nds)), [setNodes]);
  const onEdgesChange = useCallback((changes: EdgeChange<Edge>[]) => setEdges(eds => applyEdgeChanges(changes, eds)), [setEdges]);
  const onConnect = useCallback((connection: any) => setEdges(eds => addEdge(connection, eds)), [setEdges]);
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
        colorMode='light'
        proOptions={{ hideAttribution: true }}
        fitView>
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}
