import { useState, useCallback } from "react";
import { StrategyCard } from "@/components/dashboard/StrategyCard";
import { AgentWorkflow } from "@/components/dashboard/AgentWorkflow";
import { ActivityLogView, useActivityLog } from "@/components/dashboard/ActivityLog";
import { ControlTower } from "@/components/dashboard/ControlTower";
import { CVUpload } from "@/components/dashboard/CVUpload";

const Dashboard = () => {
  const { logs, addLog, clearLogs } = useActivityLog();
  const [autoStart, setAutoStart] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCVUploaded = useCallback(() => {
    clearLogs();
    setAutoStart(true);
    setIsProcessing(true);
  }, [clearLogs]);

  const handleWorkflowStart = useCallback(() => {
    clearLogs();
  }, [clearLogs]);

  const handleWorkflowComplete = useCallback(() => {
    setAutoStart(false);
    setIsProcessing(false);
  }, []);

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div>
          <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">AI-powered job acquisition command center</p>
        </div>
        <CVUpload onCVUploaded={handleCVUploaded} isProcessing={isProcessing} />
        <StrategyCard />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AgentWorkflow
            onAgentComplete={addLog}
            onWorkflowStart={handleWorkflowStart}
            onWorkflowComplete={handleWorkflowComplete}
            autoStart={autoStart}
          />
          <ActivityLogView logs={logs} />
        </div>
      </div>
      <div className="w-[320px] border-l border-border/50 p-5 overflow-y-auto scrollbar-thin hidden xl:block">
        <ControlTower />
      </div>
    </div>
  );
};

export default Dashboard;
