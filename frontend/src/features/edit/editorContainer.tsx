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
  type NodeTypes,
} from '@xyflow/react';
import { useCallback, useState, useEffect } from 'react';
import '@xyflow/react/dist/style.css';

export function EditorContainer(props: { nodesList: Node[]; edgesList: Edge[]; nodeTypes: NodeTypes; }) {
  const [nodes, setNodes] = useState(props.nodesList);
  const [edges, setEdges] = useState(props.edgesList);
  useEffect(() => {
    setNodes(props.nodesList);
  }, [props.nodesList]);
  useEffect(() => {
    setEdges(props.edgesList);
  }, [props.edgesList]);

  const onNodesChange = useCallback((changes: NodeChange<Node>[]) => setNodes(nds => applyNodeChanges(changes, nds)), [setNodes]);
  const onEdgesChange = useCallback((changes: EdgeChange<Edge>[]) => setEdges(eds => applyEdgeChanges(changes, eds)), [setEdges]);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        nodeTypes={props.nodeTypes}
        colorMode='light'
        proOptions={{ hideAttribution: true }}
        fitView>
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}
