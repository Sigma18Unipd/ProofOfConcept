import { AutomationList } from "./automationList";
import { TopContainer } from "./topContainer";

export default function Dashboard() {
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
