import React from 'react';
import { cn } from '../../utils/cn';

export function Table({ className, children, ...props }) {
    return (
        <div className="relative overflow-x-auto shadow-sm sm:rounded-lg border border-slate-200 bg-white">
            <table className={cn("w-full text-sm text-left text-slate-500", className)} {...props}>
                {children}
            </table>
        </div>
    );
}

export function TableHeader({ className, children, ...props }) {
    return (
        <thead className={cn("text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200", className)} {...props}>
            {children}
        </thead>
    );
}

export function TableBody({ className, children, ...props }) {
    return (
        <tbody className={cn("bg-white divide-y divide-slate-100", className)} {...props}>
            {children}
        </tbody>
    );
}

export function TableRow({ className, children, ...props }) {
    return (
        <tr className={cn("bg-white hover:bg-slate-50 transition-colors", className)} {...props}>
            {children}
        </tr>
    );
}

export function TableHead({ className, children, ...props }) {
    return (
        <th scope="col" className={cn("px-6 py-3 font-semibold tracking-wider", className)} {...props}>
            {children}
        </th>
    );
}

export function TableCell({ className, children, ...props }) {
    return (
        <td className={cn("px-6 py-4 whitespace-nowrap", className)} {...props}>
            {children}
        </td>
    );
}
