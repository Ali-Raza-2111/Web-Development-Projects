import React from 'react';
import { cn } from '../../utils/cn';
import Button from './Button';

export default function EmptyState({ title, description, icon: Icon, action, className }) {
    return (
        <div className={cn("text-center py-12 px-4 rounded-lg bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center", className)}>
             {Icon && <div className="p-3 bg-slate-100 rounded-full mb-4"><Icon className="h-8 w-8 text-slate-400" /></div>}
             <h3 className="text-lg font-medium text-slate-900">{title}</h3>
             <p className="mt-1 text-sm text-slate-500 max-w-sm">{description}</p>
             {action && <div className="mt-6">{action}</div>}
        </div>
    );
}
