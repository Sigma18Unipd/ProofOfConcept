import { Handle, Position } from '@xyflow/react';
import { Card, CardTitle } from '@/components/ui/card';

export function SimpleNode({ data } : { data: { title: string }  }) {
  return (
    <Card style={{ padding: "20px" }} className='gap-2'>
      <Handle type='target' position={Position.Left} isConnectable />
      <CardTitle>
        {data.title}
      </CardTitle>
        Descrizione del blocco
      <Handle type='source' position={Position.Right} isConnectable />
    </Card>
  );
}
