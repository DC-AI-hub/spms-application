import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useTheme } from '../theme/ThemeContext';

/**
 * Main admin layout component
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Content to be rendered in main area
 * @returns {JSX.Element} Admin layout structure
 */
const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {theme} = useTheme();

  useEffect(() => {
    const savedState = localStorage.getItem('sidebarOpen');
    if (savedState !== null) {
      setSidebarOpen(savedState === 'true');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sidebarOpen', sidebarOpen);
  }, [sidebarOpen]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  return (
    <div className="flex h-screen" style={{ backgroundColor: theme.palette.background.default }} >
      {/* Sidebar */}
      <div className={`transition-all duration-300 ${sidebarOpen ? '' : 'w-0'}`}>
        <Sidebar />
      </div>
      
      <div className="flex flex-1 flex-col overflow-hidden" >
        {/* Header */}
        <Header onToggleSidebar={toggleSidebar} className="z-10" />
        
        {/* Main Content */}
        <main className=" flex-1 overflow-x-hidden overflow-y-auto" >
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
