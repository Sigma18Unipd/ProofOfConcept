import { Handle, Position } from '@xyflow/react';
import { Card, CardHeader } from '@/components/ui/card';

export function SimpleNode({ data } : { data: { value: string }  }) {
  return (
    <Card className='w-[200px] h-[70px]'>
      <Handle type='target' position={Position.Left} isConnectable />
      <CardHeader>
        {data.value}
      </CardHeader>
        
      <Handle type='source' position={Position.Right} id='output' isConnectable />
    </Card>
  );
}
