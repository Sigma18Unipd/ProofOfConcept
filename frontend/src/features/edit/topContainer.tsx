import { useParams } from 'react-router';
import { RainbowButton } from '@/components/magicui/rainbow-button';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';;

export function TopContainer() {
  const { id } = useParams();
  return (
    <div className='flex items-center place-content-between' style={{ margin: '0 24px', gridArea: 'topContainer' }}>
      <div>{id}</div>
      <div className='flex gap-4'>
        <AlertDialog>
          <AlertDialogTrigger>
            <Button variant={'destructive'}>Delete</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure to remove this workflow?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this automation from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button variant={'destructive'}>Continue</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <AlertDialog>
          <AlertDialogTrigger>
            <RainbowButton>AI Routine Builder</RainbowButton>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>AI Routine Builder</AlertDialogTitle>
              <AlertDialogDescription>
                From words to workflows, powered by AI.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <Textarea placeholder='Describe your routine here' className='resize-none' />
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <RainbowButton>Generate Workflow</RainbowButton>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Button>Save</Button>
        <Button>Run</Button>
      </div>
    </div>
  );
}
