import { ControlTower as ControlTowerPanel } from "@/components/dashboard/ControlTower";

const ControlTowerPage = () => (
  <div className="p-6 max-w-lg">
    <div className="mb-6">
      <h1 className="text-xl font-bold text-foreground">Control Tower</h1>
      <p className="text-sm text-muted-foreground">Full system parameter controls</p>
    </div>
    <ControlTowerPanel />
  </div>
);

export default ControlTowerPage;
