import React from 'react';
import { cn } from '../../utils/cn';

const Input = React.forwardRef(({ className, label, error, id, ...props }, ref) => {
  const inputId = id || React.useId();
  
  return (
    <div className="w-full">
      {label && <label htmlFor={inputId} className="form-label">{label}</label>}
      <input
        id={inputId}
        className={cn(
          "form-input",
          error && "border-red-500 focus:border-red-500 focus:ring-red-200",
          className
        )}
        ref={ref}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
});

Input.displayName = "Input";
export default Input;
