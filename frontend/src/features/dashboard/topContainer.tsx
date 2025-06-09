import { Button } from '@/components/ui/button';

export function TopContainer() {
  return (
    <div className='flex items-center place-content-between' style={{ margin: '0 24px', gridArea: 'topContainer' }}>
      <div>Welcome back, <span style={{ fontWeight: '500' }}>Email del tizio</span></div>
      <div className='flex gap-4'>
        <Button>Create a Routine</Button>
        <Button variant={'destructive'}>Logout</Button>
      </div>
    </div>
  );
}
