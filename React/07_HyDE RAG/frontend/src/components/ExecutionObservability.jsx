import React, { useState, useEffect, useRef } from 'react';
import { Check, Loader2, Maximize2, Minimize2, Play, ChevronDown, ChevronRight, XCircle, FileText, Sparkles } from 'lucide-react';
import { cn } from '../utils/cn';

const steps = [
  { id: 1, label: 'User Query Received' },
  { id: 2, label: 'Hypothetical Document Generated (HyDE)' },
  { id: 3, label: 'Hypothetical Embedding Created' },
  { id: 4, label: 'Vector Search Executed' },
  { id: 5, label: 'Top-K Chunks Retrieved' },
  { id: 6, label: 'Context Assembled' },
  { id: 7, label: 'LLM Response Generation' },
  { id: 8, label: 'Final Answer Delivered' },
];

/* ── Rich metadata renderer ─────────────────────────────────────────── */
const MetadataRenderer = ({ stepId, metadata }) => {
  if (!metadata) return null;

  // Step 1: User Query
  if (stepId === 1 && metadata.query) {
    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-1.5 text-blue-500 dark:text-blue-400 font-semibold text-[11px] uppercase tracking-wider">
          <Sparkles size={12} />
          <span>Query</span>
        </div>
        <p className="text-slate-700 dark:text-slate-300 font-sans text-xs leading-relaxed bg-white dark:bg-slate-900 p-2.5 rounded border border-slate-200 dark:border-slate-700">
          {metadata.query}
        </p>
        {metadata.timestamp && (
          <span className="text-[10px] text-slate-400">{metadata.timestamp}</span>
        )}
      </div>
    );
  }

  // Step 2: HyDE Generated Document
  if (stepId === 2 && metadata.hypothetical_document) {
    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-1.5 text-purple-500 dark:text-purple-400 font-semibold text-[11px] uppercase tracking-wider">
          <Sparkles size={12} />
          <span>Hypothetical Document</span>
        </div>
        <div className="text-slate-700 dark:text-slate-300 font-sans text-xs leading-relaxed bg-white dark:bg-slate-900 p-2.5 rounded border border-purple-200 dark:border-purple-800/50 max-h-48 overflow-y-auto">
          {metadata.hypothetical_document}
        </div>
        {metadata.char_count && (
          <span className="text-[10px] text-slate-400">{metadata.char_count} characters</span>
        )}
      </div>
    );
  }

  // Step 5: Retrieved Chunks
  if (stepId === 5 && metadata.chunks && metadata.chunks.length > 0) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-emerald-500 dark:text-emerald-400 font-semibold text-[11px] uppercase tracking-wider">
            <FileText size={12} />
            <span>Retrieved Documents</span>
          </div>
          <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-[10px] px-1.5 py-0.5 rounded-full font-medium">
            {metadata.retrieved_count || metadata.chunks.length} chunks
          </span>
        </div>
        <div className="space-y-1.5">
          {metadata.chunks.map((chunk, i) => (
            <div 
              key={i} 
              className="bg-white dark:bg-slate-900 p-2.5 rounded border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                  #{chunk.rank || i + 1}
                </span>
                {chunk.source && (
                  <span className="text-[10px] text-slate-400 truncate max-w-[140px]" title={chunk.source}>
                    {chunk.source}
                  </span>
                )}
                {chunk.score && (
                  <span className="text-[10px] bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-1.5 py-0.5 rounded">
                    {chunk.score}
                  </span>
                )}
              </div>
              <p className="text-slate-600 dark:text-slate-400 font-sans text-[11px] leading-relaxed line-clamp-3">
                {chunk.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default: render key-value pairs nicely
  return (
    <div className="space-y-1.5">
      {Object.entries(metadata).map(([key, val]) => (
        <div key={key} className="flex items-start gap-2">
          <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider min-w-[80px] shrink-0 pt-0.5">
            {key.replace(/_/g, ' ')}
          </span>
          <span className="text-xs text-slate-700 dark:text-slate-300 font-sans break-all">
            {typeof val === 'object' ? JSON.stringify(val) : String(val)}
          </span>
        </div>
      ))}
    </div>
  );
};

/* ── Progress bar ────────────────────────────────────────────────────── */
const ProgressBar = ({ currentStep, totalSteps, status }) => {
  const pct = status === 'complete' 
    ? 100 
    : Math.round(((currentStep - 1) / totalSteps) * 100);
  
  return (
    <div className="px-4 pt-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Pipeline Progress</span>
        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{pct}%</span>
      </div>
      <div className="h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
        <div 
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            status === 'error' ? "bg-red-500" : "bg-gradient-to-r from-blue-500 to-purple-500"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

/* ── Main Component ──────────────────────────────────────────────────── */
const ExecutionObservability = ({ 
  isOpen, 
  onClose, 
  currentStep, 
  stepStatus, 
  stepMetadata, 
  onReplay 
}) => {
  const [expandedSteps, setExpandedSteps] = useState({});
  const activeRef = useRef(null);

  useEffect(() => {
    // Auto-expand current step if it has metadata
    if (currentStep && stepMetadata[currentStep]) {
      setExpandedSteps(prev => ({ ...prev, [currentStep]: true }));
    }
  }, [currentStep, stepMetadata]);

  // Auto-scroll to active step
  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [currentStep]);

  const toggleStep = (stepId) => {
    setExpandedSteps(prev => ({
      ...prev,
      [stepId]: !prev[stepId]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-xl w-80 lg:w-96 transition-all duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div>
           <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">Execution Observability</h2>
           <p className="text-xs text-slate-500 dark:text-slate-400">HyDE Pipeline Trace</p>
        </div>
        <div className="flex items-center space-x-1">
             <button 
                onClick={onReplay} 
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md text-slate-500 dark:text-slate-400 transition-colors"
                title="Replay Execution"
             >
                 <Play size={16} />
             </button>
             <button 
                onClick={onClose} 
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md text-slate-500 dark:text-slate-400 transition-colors"
             >
                 <Minimize2 size={16} />
             </button>
        </div>
      </div>

      {/* Progress Bar */}
      {currentStep > 0 && (
        <ProgressBar currentStep={currentStep} totalSteps={steps.length} status={stepStatus} />
      )}

      {/* Steps Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {steps.map((step, index) => {
          const isCompleted = step.id < currentStep || (step.id === currentStep && stepStatus === 'complete');
          const isActive = step.id === currentStep && stepStatus === 'active';
          const isPending = step.id > currentStep;
          const isFailed = step.id === currentStep && stepStatus === 'error';
          
          let statusColor = "bg-slate-200 border-slate-300 dark:bg-slate-800 dark:border-slate-700";
          let textColor = "text-slate-500 dark:text-slate-400";
          let glowClass = "";

          if (isCompleted) {
            statusColor = "bg-green-500 border-green-600 dark:bg-green-600 dark:border-green-500 text-white";
            textColor = "text-slate-800 dark:text-white font-medium";
          } else if (isActive) {
            statusColor = "bg-blue-500 border-blue-600 dark:bg-blue-600 dark:border-blue-500 text-white animate-pulse";
            textColor = "text-blue-600 dark:text-blue-400 font-bold";
            glowClass = "shadow-[0_0_15px_rgba(59,130,246,0.5)]";
          } else if (isFailed) {
            statusColor = "bg-red-500 border-red-600 text-white";
            textColor = "text-red-600 dark:text-red-400 font-bold";
          }

          const hasMetadata = stepMetadata[step.id];

          return (
            <div key={step.id} className="relative pl-8" ref={isActive ? activeRef : null}>
              {/* Connector Line */}
              {index !== steps.length - 1 && (
                <div className={cn(
                  "absolute left-[11px] top-7 w-[2px] h-full -mb-6 transition-colors duration-500",
                  isCompleted ? "bg-green-500 dark:bg-green-600" : "bg-slate-200 dark:bg-slate-800"
                )} />
              )}

              {/* Node Circle */}
              <div className={cn(
                "absolute left-0 top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center z-10 transition-all duration-300",
                statusColor,
                glowClass
              )}>
                {isCompleted ? <Check size={14} strokeWidth={3} /> : 
                 isActive ? <div className="w-2 h-2 bg-white rounded-full animate-ping" /> :
                 isFailed ? <XCircle size={14} /> :
                 <div className="w-2 h-2 bg-slate-400 dark:text-slate-500 rounded-full" />}
              </div>

              {/* Step Content */}
              <div 
                 className={cn(
                    "flex flex-col transition-all duration-300",
                    isActive ? "translate-x-1" : ""
                 )}
              >
                  <div 
                     className="flex items-center justify-between cursor-pointer group"
                     onClick={() => hasMetadata && toggleStep(step.id)}
                  >
                     <span className={cn("text-sm transition-colors", textColor)}>{step.label}</span>
                     
                     {isActive && <Loader2 size={14} className="animate-spin text-blue-500 ml-2" />}
                     
                     {hasMetadata && (
                        <div className="ml-2 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300">
                           {expandedSteps[step.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </div>
                     )}
                  </div>

                  {/* Metadata Dropdown */}
                  <div className={cn(
                      "overflow-hidden transition-all duration-300 rounded-md mt-2",
                      expandedSteps[step.id] ? "max-h-[800px] opacity-100 mb-2 overflow-y-auto" : "max-h-0 opacity-0"
                  )}>
                      <div className="p-3 bg-slate-100 dark:bg-slate-950/50 rounded-md border border-slate-200 dark:border-slate-800">
                         <MetadataRenderer stepId={step.id} metadata={stepMetadata[step.id]} />
                      </div>
                  </div>
              </div>
            </div>
          );
        })}
      </div>
    
      {/* Footer */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-center">
         <span className="text-[10px] text-slate-400 uppercase tracking-widest">System Status: Online</span>
      </div>
    </div>
  );
};

export default ExecutionObservability;
