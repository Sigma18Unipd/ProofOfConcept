import { useState } from 'react';
import { EditorContainer } from './editorContainer';
import { TopContainer } from './topContainer';
import {
  type Node,
  type Edge,
} from '@xyflow/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { systemWaitSeconds } from './nodes/systemWaitSeconds';
import { telegramSendBotMessage } from './nodes/telegramSendBotMessage';



const nodeTypes = { systemWaitSeconds: systemWaitSeconds, telegramSendBotMessage: telegramSendBotMessage };
const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];



export default function Edit() {
  const [currentNodes, setNodes] = useState<Node[]>(initialNodes);
  const [currentEdges, setEdges] = useState<Edge[]>(initialEdges);
  const [name, setName] = useState<string>('');

  //Verifica Auth
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!document.cookie.includes('authToken')) {
      navigate('/login');
      return;
    }
    axios.post("http://localhost:5000/api/verifyToken", {}, { withCredentials: true }).then((res) => {
      if (res.status !== 200 ) {
        navigate("/login");
      } else {
        setLoading(false);
      }
    }).catch(() => {
      navigate("/login");
    });
  }, [navigate]);

  if (loading) return null;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gridTemplateRows: '80px 1fr',
        gridTemplateAreas: '"topContainer" "editorContainer"',
        height: '100vh',
      }}>
      <TopContainer setNodes={setNodes} setEdges={setEdges} nodes={currentNodes} edges={currentEdges} name={name} />
      <EditorContainer setNodes={setNodes} setEdges={setEdges} nodesList={currentNodes} edgesList={currentEdges} nodeTypes={nodeTypes} setName={setName} />
    </div>
  );
}
