import React from 'react';
import { cn } from '../../utils/cn';

export function Card({ className, children, ...props }) {
  return (
    <div className={cn("card", className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children, title, description, actions, ...props }) {
  return (
    <div className={cn("card-header flex items-center justify-between", className)} {...props}>
       <div>
         {title && <h3 className="text-lg font-semibold text-slate-900 leading-none">{title}</h3>}
         {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
       </div>
       {actions && <div className="flex items-center gap-2">{actions}</div>}
       {!title && !description && children}
    </div>
  );
}

export function CardBody({ className, children, ...props }) {
  return (
    <div className={cn("card-body", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }) {
    return (
      <div className={cn("px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center", className)} {...props}>
        {children}
      </div>
    );
}

export default Card;
