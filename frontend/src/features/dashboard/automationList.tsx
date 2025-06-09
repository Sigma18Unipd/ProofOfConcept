import { Card, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

export function AutomationList() {
  return (
    <div
      style={{
        gridArea: 'listContainer',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        alignItems: 'center',
        paddingTop: '20px',
      }}>
      {Array.from({ length: 3 }).map(() => (
        <Card className='w-full max-w-sm' onClick={() => window.location.href = '/edit/123'}>
          <div className='flex justify-between items-center gap-6' style={{ padding: '0px 10px 0px 20px' }}>
            Card Title
            <Button variant='ghost' size='icon'>
                <Play className='h-4 w-4' />
              </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
