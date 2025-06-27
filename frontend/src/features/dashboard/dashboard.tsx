import { AutomationList } from "./automationList";
import { TopContainer } from "./topContainer";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  //Verifica Auth
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!document.cookie.includes('authToken')) {
      navigate('/login');
      return;
    }
    axios.post("http://localhost:5000/api/verifyToken", {}, { withCredentials: true }).then((res) => {
      if (res.status !== 200 ) {
        navigate("/login");
      } else {
        setLoading(false);
      }
    }).catch(() => {
      navigate("/login");
    });
  }, [navigate]);
  if (loading) return null;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gridTemplateRows: '80px 1fr',
        gridTemplateAreas: '"topContainer" "listContainer"',
        height: '100vh',
      }}>
      <TopContainer />
      <AutomationList />
    </div>
  );
}