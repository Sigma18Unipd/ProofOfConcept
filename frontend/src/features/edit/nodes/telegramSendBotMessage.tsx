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

export function telegramSendBotMessage({ data }: { data: { botToken: string, chatId: string, message?: string } }) {
  return (
    <Card style={{ padding: '20px 10px 20px 20px' }} className='gap-2'>
      <Handle type='target' position={Position.Left} isConnectable />
      <div className='flex justify-between items-center gap-6'>
        <CardTitle>Telegram - Send Bot Message</CardTitle>
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
              <Label>Bot Token</Label>
              <Input type='text' placeholder='Enter your Bot token' defaultValue={data.botToken} />
            </div>
            <div className='grid gap-2'>
              <Label>Chat ID</Label>
              <Input type='text' placeholder='Enter your Chat ID' defaultValue={data.chatId} />
            </div>
            <div className='grid gap-2'>
              <Label>Message</Label>
              <Input type='text' placeholder='Enter your message' defaultValue={data.message} />
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
