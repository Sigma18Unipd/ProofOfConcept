import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import axios from 'axios';
import { useEffect, useState } from 'react';



type Workflow = {
  id: number;
  clientEmail: string;
  name: string;
  contents: string;
};



export function AutomationList() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  useEffect(() => {
    axios
      .post("http://localhost:5000/api/flows", {}, { withCredentials: true })
      .then((res) => {
        setWorkflows(res.data.workflows);
      })
      .catch(() => {
        console.log("Errore");
      });
  }, []);

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
      {workflows.map((workflow) => (
        <Card className='w-full max-w-sm' onClick={() => window.location.href = `/edit/${workflow.id}`} key={workflow.id}>
          <div className='flex justify-between items-center gap-6' style={{ padding: '0px 10px 0px 20px' }}>
            {workflow.name}
            <Button variant='ghost' size='icon'>
                <Play className='h-4 w-4' />
              </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
