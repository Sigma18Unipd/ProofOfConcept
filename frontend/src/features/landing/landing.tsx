import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div>
      Landing Page<br/><br/>
      <Button onClick={() => { navigate('/login') }}>Login</Button>
      <br/><br/>
      <Button onClick={() => { navigate('/register') }}>Register</Button>
    </div>
  );
}