import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, AlertCircle, LogOut, Layers, User } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import api from '../../services/api';

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: FolderKanban, label: 'Projects', path: '/projects' },
    { icon: AlertCircle, label: 'Errors', path: '/errors' },
];

export function Sidebar({ className }) {
    const dispatch = useDispatch();
    const [user, setUser] = useState(null);

    useEffect(() => {
        api.get('/auth/me').then(res => setUser(res.data)).catch(() => { });
    }, []);

    const handleLogout = () => {
        dispatch(logout());
        window.location.href = '/';
    };

    return (
        <aside className={cn("hidden md:flex flex-col w-64 border-r border-zinc-800 bg-[#0f172a] h-full", className)}>
            <div className="flex h-16 items-center px-6 border-b border-zinc-800 space-x-3">
                <div className="h-8 w-8 rounded-md bg-blue-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]">
                    <Layers className="h-5 w-5" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white font-sans">BugScope</span>
            </div>

            <div className="flex-1 py-6 flex flex-col gap-1 px-4">
                <div className="px-3 mb-2 text-xs font-semibold text-zinc-500 tracking-wider">
                    MENU
                </div>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            cn(
                                "group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-blue-600 text-white font-semibold shadow-sm"
                                    : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100"
                            )
                        }
                    >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                    </NavLink>
                ))}
            </div>

            <div className="p-4 mt-auto border-t border-zinc-800 w-full flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-zinc-800 flex items-center justify-center">
                        <User className="h-5 w-5 text-zinc-400" />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-medium text-white truncate">{user?.name || 'User'}</span>
                        <span className="text-xs text-zinc-400 truncate">{user?.email || ''}</span>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="group flex w-[fit-content] items-center gap-2 rounded-md py-1 text-sm font-medium text-zinc-400 hover:text-white transition-all duration-200"
                >
                    <LogOut className="h-4 w-4" />
                    Log out
                </button>
            </div>
        </aside>
    );
}
