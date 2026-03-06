import React from 'react';
import { cn } from '../../lib/utils';

const Badge = React.forwardRef(({ className, variant = 'default', ...props }, ref) => {
    const baseStyles = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

    const variants = {
        default: "border-transparent bg-blue-100 text-blue-700 hover:bg-blue-200",
        success: "border-transparent bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
        error: "border-transparent bg-red-100 text-red-700 hover:bg-red-200",
        warning: "border-transparent bg-amber-100 text-amber-700 hover:bg-amber-200",
        outline: "text-gray-600 border-gray-300",
    };

    return (
        <div ref={ref} className={cn(baseStyles, variants[variant], className)} {...props} />
    );
});
Badge.displayName = "Badge";

export { Badge };
