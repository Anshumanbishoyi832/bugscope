import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './Button';

export function CodeBlock({ code, language, className }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={cn("relative rounded-xl overflow-hidden shadow-sm bg-[#0e1629]", className)}>
            <div className="flex items-center justify-between px-4 py-2 bg-[#1a2333]">
                <span className="text-xs font-mono text-gray-400">{language}</span>
                <Button variant="ghost" size="sm" onClick={handleCopy} className="h-6 w-6 p-0 text-gray-400 hover:text-white hover:bg-white/10">
                    {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </Button>
            </div>
            <div className="p-4 overflow-x-auto">
                <pre className="text-sm font-mono leading-relaxed text-gray-300">
                    <code>{code}</code>
                </pre>
            </div>
        </div>
    );
}
