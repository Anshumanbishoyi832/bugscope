import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { AlertCircle, Terminal, Globe, Clock, CheckCircle2 } from 'lucide-react';
import { SidePanel } from '../ui/SidePanel';
import { CodeBlock } from '../ui/CodeBlock';
import { Badge } from '../ui/Badge';
import { Card, CardContent } from '../ui/Card';

export function ErrorSidePanel({ error, isOpen, onClose }) {
    if (!error) return null;

    return (
        <SidePanel
            isOpen={isOpen}
            onClose={onClose}
            title="Issue Details"
            className="md:max-w-2xl lg:max-w-3xl"
        >
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">

                {/* Error Header */}
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Badge variant={error.status === 'resolved' ? 'success' : 'error'}>
                            {error.status === 'resolved' ? 'Resolved' : 'Active'}
                        </Badge>
                        <span className="text-sm text-gray-500 font-mono">
                            Event ID: {error._id}
                        </span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 break-words mb-4">
                        {error.message || 'Unknown Error'}
                    </h1>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-gray-50 border-gray-200 shadow-none">
                        <CardContent className="p-4 flex flex-col items-start gap-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <div>
                                <p className="text-xs font-medium text-gray-500 mb-0.5">Occurred</p>
                                <p className="text-sm text-gray-900">
                                    {error.createdAt ? formatDistanceToNow(new Date(error.createdAt), { addSuffix: true }) : 'N/A'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-50 border-gray-200 shadow-none overflow-hidden">
                        <CardContent className="p-4 flex flex-col items-start gap-2 h-full">
                            <Globe className="w-4 h-4 text-gray-500 shrink-0" />
                            <div className="w-full min-w-0">
                                <p className="text-xs font-medium text-gray-500 mb-0.5">Browser/OS</p>
                                <p className="text-sm text-gray-900 overflow-x-auto whitespace-nowrap pb-1 scrollbar-thin">
                                    {error.userAgent || error.browser || 'Unknown'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-50 border-gray-200 shadow-none col-span-2 overflow-hidden">
                        <CardContent className="p-4 flex flex-col items-start gap-2 h-full">
                            <Terminal className="w-4 h-4 text-gray-500 shrink-0" />
                            <div className="w-full min-w-0">
                                <p className="text-xs font-medium text-gray-500 mb-0.5">URL</p>
                                <p className="text-sm text-gray-900 font-mono overflow-x-auto whitespace-nowrap pb-1 scrollbar-thin">
                                    {error.url || 'N/A'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Stack Trace */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        Stack Trace
                    </h3>
                    {error.stack ? (
                        <CodeBlock
                            language="javascript"
                            code={error.stack}
                            className="max-h-[400px] overflow-y-auto"
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center p-8 border border-gray-200 rounded-lg bg-gray-50">
                            <p className="text-gray-500">No stack trace available for this error.</p>
                        </div>
                    )}
                </div>

            </div>
        </SidePanel>
    );
}
