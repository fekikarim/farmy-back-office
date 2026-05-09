import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { cn } from '../../utils/cn';

interface PageWrapperProps {
  children: React.ReactNode;
}

const PageWrapper = ({ children }: PageWrapperProps) => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar_collapsed');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('sidebar_collapsed', String(isCollapsed));
  }, [isCollapsed]);

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex">
      {/* Sidebar */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main Content */}
      <div className={cn(
        "flex-1 flex flex-col transition-all duration-300",
        isCollapsed ? "pl-16" : "pl-[260px]"
      )}>
        <Topbar />
        
        <main className="flex-1 p-6 lg:p-8 animate-in fade-in duration-500">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
        
        {/* Footer */}
        <footer className="px-8 py-6 border-t border-border text-center text-xs text-text-muted">
          <p>© {new Date().getFullYear()} Farmy Agri-Tech Platform. Production Grade Admin Dashboard.</p>
        </footer>
      </div>
    </div>
  );
};

export default PageWrapper;
