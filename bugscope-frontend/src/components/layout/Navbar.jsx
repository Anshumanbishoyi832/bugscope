import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Bell, User, Menu } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { selectProject } from '../../store/projectSlice';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';

export function Navbar({ onMenuClick }) {
    const dispatch = useDispatch();
    const { list, selectedProject } = useSelector(state => state.projects);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const currentProject = list.find(p => p._id === selectedProject) || list[0];

    // Close dropdown on outside click or Escape key
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsDropdownOpen(false);
            }
        };
        const handleEsc = (e) => { if (e.key === 'Escape') setIsDropdownOpen(false); };
        document.addEventListener('mousedown', handleOutsideClick);
        document.addEventListener('keydown', handleEsc);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
            document.removeEventListener('keydown', handleEsc);
        };
    }, []);

    const handleSelect = (projectId) => {
        dispatch(selectProject(projectId));
        setIsDropdownOpen(false);
    };

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white/80 px-4 md:px-6 backdrop-blur-md">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
                    <Menu className="h-5 w-5 text-gray-500" />
                </Button>

                {/* Project Selector */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        <div className="h-5 w-5 rounded bg-blue-500/10 text-blue-600 flex items-center justify-center text-xs ml-1">
                            {currentProject?.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        {currentProject?.name || "Select Project"}
                        <ChevronDown className={cn("h-4 w-4 text-gray-400 transition-transform", isDropdownOpen && "rotate-180")} />
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute top-full left-0 mt-2 w-56 rounded-md border border-gray-200 bg-white shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="p-1">
                                {list.length > 0 ? (
                                    list.map(p => (
                                        <button
                                            key={p._id}
                                            onClick={() => handleSelect(p._id)}
                                            className={cn(
                                                "flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm transition-colors",
                                                selectedProject === p._id ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                            )}
                                        >
                                            {p.name}
                                        </button>
                                    ))
                                ) : (
                                    <div className="px-3 py-2 text-sm text-gray-500">No projects found</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className="relative rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.3)]" />
                </button>
                <div className="h-8 w-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden cursor-pointer hover:border-gray-300 transition-colors">
                    <User className="h-4 w-4 text-gray-500" />
                </div>
            </div>
        </header>
    );
}
