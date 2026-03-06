import React, { useEffect, useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { setProjects, selectProject } from '../../store/projectSlice';
import api from '../../services/api';
import { Outlet } from 'react-router-dom';

export function Layout({ children }) {
    const dispatch = useDispatch();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { list: projects, selectedProject } = useSelector(state => state.projects);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await api.get('/projects');
                dispatch(setProjects(res.data));

                // Auto-select first project if none is selected
                if (res.data.length > 0 && !selectedProject) {
                    dispatch(selectProject(res.data[0]._id));
                } else if (res.data.length > 0 && selectedProject) {
                    // Verify selected project still exists
                    const exists = res.data.find(p => p._id === selectedProject);
                    if (!exists) {
                        dispatch(selectProject(res.data[0]._id));
                    }
                }
            } catch (err) {
                console.error('Failed to fetch projects in layout', err);
            }
        };

        fetchProjects();
    }, [dispatch]);

    return (
        <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <Sidebar />
            </div>

            {/* Main Content Area */}
            <div className="flex flex-1 flex-col overflow-hidden relative">
                <Navbar onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />

                <main className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-8">
                    <div className="mx-auto max-w-7xl">
                        {children || <Outlet />}
                    </div>
                </main>
            </div>

        </div>
    );
}
