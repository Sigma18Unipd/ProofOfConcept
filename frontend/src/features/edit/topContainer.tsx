import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RainbowButton } from '@/components/magicui/rainbow-button';
import axios from 'axios';
import type { Edge, Node } from '@xyflow/react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';

export function TopContainer(
  props: { 
    setNodes: (nodes: Node[]) => void;
    setEdges: (edges: Edge[]) => void;
    nodes: Node[];
    edges: Edge[];
    name: string;
  }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [promptValue, setPromptValue] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openAiRoutineDialog, setOpenAiRoutineDialog] = useState(false);
  return (
    <div className='flex items-center place-content-between' style={{ margin: '0 24px', gridArea: 'topContainer' }}>
      <div><Button onClick= { ()=> { navigate("/dashboard") }}>Back to Dashboard</Button><span style={{ marginLeft: 20 }}>{props.name}</span></div>
      <div className='flex gap-4'>
        <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
          <DialogTrigger asChild>
            <Button variant={'destructive'}>Delete</Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[500px]'>
            <DialogHeader>
              <DialogTitle>Delete workflow</DialogTitle>
              <DialogDescription>Are you sure you want to delete this workflow?</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant='outline'>Cancel</Button>
              </DialogClose>
              <Button variant='destructive'
                onClick={() => {
                  axios.delete(`http://localhost:5000/api/flows/${id}/delete`, { withCredentials: true })
                    .then(res => {
                      console.log("Workflow deleted", res.data);
                      navigate("/dashboard");
                    })
                    .catch(err => {
                      console.error("Error deleting workflow:", err);
                    })
                    .finally(() => {
                      setOpenDeleteDialog(false);
                    });
                }}>
                Delete Workflow
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={openAiRoutineDialog} onOpenChange={setOpenAiRoutineDialog}>
          <DialogTrigger asChild>
            <RainbowButton>AI Routine Builder</RainbowButton>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[500px]'>
            <DialogHeader>
              <DialogTitle>AI Routine Builder</DialogTitle>
              <DialogDescription>From words to workflows, powered by AI.</DialogDescription>
            </DialogHeader>
            <div className='grid gap-4'>
              <div className='grid gap-2'>
                <Label htmlFor='name-1'>Prompt</Label>
                <Textarea onChange={(e) => setPromptValue(e.target.value)} placeholder='Describe your routine here' className='resize-none' />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant='outline'>Cancel</Button>
              </DialogClose>
              <RainbowButton
                onClick={async () => {
                  console.log("Prompt value:", promptValue);
                  axios.post('http://localhost:5000/api/flows/prompt', { 'prompt': promptValue }, { withCredentials: true }).then(res => {
                    console.log(res.data);
                    props.setNodes(res.data.nodes);
                    props.setEdges(res.data.edges);
                  }).finally(() => {
                    console.log("Workflow generated");
                    setOpenAiRoutineDialog(false);
                  })}}>
                Generate Workflow
              </RainbowButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button onClick={() => {
          const workflowData = {
            name: props.name,
            contents: JSON.stringify({
              nodes: props.nodes,
              edges: props.edges
            })
          };
          console.log("Saving workflow data:", workflowData);
          axios.post(`http://localhost:5000/api/flows/${id}/save`, workflowData, { withCredentials: true }).then(res => {
            console.log("Workflow saved", res.data);
          }).catch(err => {
            console.error("Error saving workflow:", err);
          });
        }}>
          Save
        </Button>
        <Button onClick={() => {
          const workflowData = {
            name: props.name,
            contents: JSON.stringify({
              nodes: props.nodes,
              edges: props.edges
            })
          };
          console.log("Saving workflow data:", workflowData);
          axios.post(`http://localhost:5000/api/flows/${id}/save`, workflowData, { withCredentials: true }).then(res => {
            console.log("Workflow saved", res.data);
            console.log("Workflow run initiated");
            axios.post(`http://localhost:5000/api/flows/${id}/run`, { withCredentials: true }).then(res => {
              console.log("Workflow run response:", res.data);
            }).catch(err => {
              console.error("Error running workflow:", err);
            });
          }).catch(err => {
            console.error("Error saving workflow:", err);
          });
        }}>Run</Button>
      </div>
    </div>
  );
}
