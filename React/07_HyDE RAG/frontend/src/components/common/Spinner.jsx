import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function Spinner({ size = 'md', className, fullScreen = false }) {
    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16'
    };
    
    const spinner = <Loader2 className={cn("animate-spin text-blue-600", sizes[size], className)} />;
    
    if (fullScreen) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] w-full">
                {spinner}
                <span className="sr-only">Loading...</span>
            </div>
        )
    }

    return spinner;
}
