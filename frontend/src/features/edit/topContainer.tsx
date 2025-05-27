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
import { Textarea } from '@/components/ui/textarea';
import { BlurFade } from '@/components/magicui/blur-fade';

export function TopContainer() {
  const { id } = useParams();
  return (
    <div className='flex items-center place-content-between' style={{ margin: '0 24px', gridArea: 'topContainer' }}>
      <div>{id}</div>
      <div className='flex gap-4'>
        <AlertDialog>
          <AlertDialogTrigger>
            <BlurFade delay={0.25 * 1} inView>
              <Button variant={'destructive'}>Delete</Button>
            </BlurFade>
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
            <BlurFade delay={0.25 * 2} inView>
              <RainbowButton>AI Routine Builder</RainbowButton>
            </BlurFade>
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
        <BlurFade delay={0.25 * 3} inView>
          <Button>Save</Button>
        </BlurFade>
        <BlurFade delay={0.25 * 4} inView>
          <Button>Run</Button>
        </BlurFade>
      </div>
    </div>
  );
}
