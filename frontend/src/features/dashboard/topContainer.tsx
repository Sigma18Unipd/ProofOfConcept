import { Button } from '@/components/ui/button';
import axios from 'axios';

function logout() {
  axios.post("http://localhost:5000/logout", {}, { withCredentials: true }).then((res) => {
    if (res.status === 200 ) {
      window.location.href = "/login";
    }
  })
}

function createNewRoutine() {
  axios.post("http://localhost:5000/api/new", {}, { withCredentials: true }).then((res) => {
    if (res.status === 200 && res.data.id) {
      window.location.href = `/edit/${res.data.id}`;
    }
  }).catch((error) => {
    console.error('Failed to create routine:', error);
  });
}

export function TopContainer() {
  return (
    <div className='flex items-center place-content-between' style={{ margin: '0 24px', gridArea: 'topContainer' }}>
      <div>Welcome back, <span style={{ fontWeight: '500' }}>Email del tizio</span></div>
      <div className='flex gap-4'>
        <Button onClick={() => createNewRoutine()}>Create a Routine</Button>
        <Button variant={'destructive'} onClick={() => logout()}>Logout</Button>
      </div>
    </div>
  );
}
