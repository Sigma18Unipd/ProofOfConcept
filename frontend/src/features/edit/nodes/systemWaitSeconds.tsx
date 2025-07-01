import { Handle, Position } from '@xyflow/react';
import { Card, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export function systemWaitSeconds({ data }: { data: { title: string, seconds: string } }) {
  return (
    <Card style={{ padding: '20px 10px 20px 20px' }} className='gap-2'>
      <Handle type='target' position={Position.Left} isConnectable />
      <div className='flex justify-between items-center gap-6'>
        <CardTitle>System - Wait (Seconds)</CardTitle>
        <AlertDialog>
          <AlertDialogTrigger>
            <Button variant='ghost' size='icon'>
              <Settings className='h-4 w-4' />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Block Settings</AlertDialogTitle>
            </AlertDialogHeader>
            Here you can configure the settings for this block.
            <div className='grid gap-2'>
              <Label>Seconds</Label>
              <Input type='text' placeholder='Insert your waiting time in seconds' defaultValue={data.seconds} />
            </div>
            <AlertDialogFooter>
              <AlertDialogAction>Save</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <Handle type='source' position={Position.Right} isConnectable />
    </Card>
  );
}
