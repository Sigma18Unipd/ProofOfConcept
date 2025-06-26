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
import { useParams } from 'react-router';



export function TopContainer(props: { setNodes: (nodes: Node[]) => void; setEdges: (edges: Edge[]) => void }) {
  const { id } = useParams();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openAiRoutineDialog, setOpenAiRoutineDialog] = useState(false);
  return (
    <div className='flex items-center place-content-between' style={{ margin: '0 24px', gridArea: 'topContainer' }}>
      <div>{id}</div>
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
                  setOpenDeleteDialog(false);
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
                <Textarea placeholder='Describe your routine here' className='resize-none' />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant='outline'>Cancel</Button>
              </DialogClose>
              <RainbowButton
                onClick={async () => {
                  axios.post('http://localhost:5000/api', {}).then(response => {
                    props.setNodes(response.data.nodes);
                    props.setEdges(response.data.edges);
                  });
                  setOpenAiRoutineDialog(false);
                }}>
                Generate Workflow
              </RainbowButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button>Save</Button>
        <Button>Run</Button>
      </div>
    </div>
  );
}
