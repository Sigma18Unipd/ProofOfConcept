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
import axios from 'axios';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router';



export function EditorContainer(props: { setNodes: (nodes: Node[]) => void; setEdges: (edges: Edge[]) => void; nodesList: Node[]; edgesList: Edge[]; nodeTypes: NodeTypes; setName: (name: string) => void; }) {
  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    axios.post(`http://localhost:5000/api/flows/${id}`, {}, { withCredentials: true }).then((res) => {
      console.log(res.data);
      props.setName(res.data.workflow.name);
      if (res.data.workflow.contents !== "") {
        const contents = JSON.parse(res.data.workflow.contents);
        props.setNodes(contents['nodes']);
        props.setEdges(contents['edges']);
      }
    }).catch(() => {
      navigate("/dashboard");
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, navigate]);



  const [nodes, setNodes] = useState(props.nodesList);
  const [edges, setEdges] = useState(props.edgesList);
  useEffect(() => {
    setNodes(props.nodesList);
  }, [props.nodesList]);
  useEffect(() => {
    setEdges(props.edgesList);
  }, [props.edgesList]);

  const onNodesChange = useCallback(
    (changes: NodeChange<Node>[]) => {
      setNodes(nds => {
        const updated = applyNodeChanges(changes, nds);
        props.setNodes(updated); // <-- sincronizza col padre
        return updated;
      });
    },
    [props]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange<Edge>[]) => {
      setEdges(eds => {
        const updated = applyEdgeChanges(changes, eds);
        props.setEdges(updated); // <-- sincronizza col padre
        return updated;
      });
    },
    [props]
  );

  const onConnect = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (connection: any) => {
      setEdges(eds => {
        const updated = addEdge(connection, eds);
        props.setEdges(updated); // <-- sincronizza col padre
        return updated;
      });
    },
    [props]
  );

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
