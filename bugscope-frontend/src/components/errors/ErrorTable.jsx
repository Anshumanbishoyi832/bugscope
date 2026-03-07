import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { AlertCircle, Globe } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/utils';

export function ErrorTable({ errors, onRowClick, onResolve, emptyStateMessage = "No errors to display." }) {

    if (!errors || errors.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center border rounded-lg border-gray-200 bg-gray-50">
                <div className="rounded-full bg-gray-100 p-4 mb-4">
                    <AlertCircle className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Errors</h3>
                <p className="text-gray-500 text-sm max-w-sm">
                    {emptyStateMessage}
                </p>
            </div>
        );
    }

    return (
        <div className="w-full overflow-x-auto border border-gray-200 rounded-lg bg-white">
            <table className="w-full text-sm text-left relative">
                <thead className="text-xs text-gray-500 bg-gray-50 uppercase border-b border-gray-200">
                    <tr>
                        <th scope="col" className="px-6 py-4 font-medium">Issue</th>
                        <th scope="col" className="px-6 py-4 font-medium hidden md:table-cell">Browser/Device</th>
                        <th scope="col" className="px-6 py-4 font-medium w-1/4">URL</th>
                        <th scope="col" className="px-6 py-4 font-medium w-32">Status</th>
                        <th scope="col" className="px-6 py-4 font-medium text-right w-32">Time</th>
                        {onResolve && <th scope="col" className="px-6 py-4 font-medium w-28">Action</th>}
                    </tr>
                </thead>
                <tbody>
                    {errors.map((error, index) => (
                        <tr
                            key={error._id || index}
                            onClick={() => onRowClick && onRowClick(error)}
                            className={cn(
                                "group border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer",
                                index === errors.length - 1 && "border-0"
                            )}
                        >
                            <td className="px-6 py-4">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className={cn(
                                        "w-4 h-4 mt-0.5 flex-shrink-0",
                                        error.status === 'resolved' ? "text-emerald-500" : "text-red-500"
                                    )} />
                                    <div>
                                        <div className="font-semibold text-gray-900 mb-1 line-clamp-1 break-all">
                                            {error.message || 'Unknown Error'}
                                        </div>
                                        <div className="text-xs text-gray-500 font-mono truncate max-w-[200px] lg:max-w-md">
                                            {error._id}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 hidden md:table-cell text-gray-500">
                                <div className="flex items-center gap-2">
                                    <Globe className="w-3 h-3 flex-shrink-0" />
                                    <span className="truncate max-w-[120px]">{error.userAgent || error.browser || 'Unknown'}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 font-mono text-xs text-gray-500 truncate max-w-[150px]">
                                {error.url || 'N/A'}
                            </td>
                            <td className="px-6 py-4">
                                <Badge variant={error.status === 'resolved' ? 'success' : 'error'}>
                                    {error.status === 'resolved' ? 'Resolved' : 'Active'}
                                </Badge>
                            </td>
                            <td className="px-6 py-4 text-right whitespace-nowrap text-gray-500 text-xs">
                                {error.createdAt ? formatDistanceToNow(new Date(error.createdAt), { addSuffix: true }) : 'N/A'}
                            </td>
                            {onResolve && (
                                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                    {error.status !== 'resolved' && (
                                        <button
                                            onClick={() => onResolve(error._id)}
                                            className="text-xs font-medium px-3 py-1.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors whitespace-nowrap"
                                        >
                                            Resolve
                                        </button>
                                    )}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
