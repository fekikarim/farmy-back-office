import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Sun, 
  Moon, 
  User, 
  LogOut, 
  Command,
  Settings as SettingsIcon,
  HelpCircle
} from 'lucide-react';
import { useTheme } from '../../providers/ThemeProvider';
import { useSocketContext } from '../../providers/SocketProvider';
import { cn } from '../../utils/cn';

const Topbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { connectionStatus } = useSocketContext();
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const user = JSON.parse(localStorage.getItem('admin_user') || '{}');
  const adminName = user.profile?.name || 'Admin';
  const adminEmail = user.email || 'admin@farmy.tn';

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    window.location.href = '/login';
  };

  return (
    <header className="h-16 border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between">
      {/* Left: Page Title & Search */}
      <div className="flex items-center gap-8 flex-1">
        <h2 className="text-xl font-sora hidden md:block">Command Center</h2>
        
        {/* Global Search */}
        <div className="relative max-w-md w-full group hidden lg:block">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-text-muted">
            <Search className="h-4 w-4" />
          </div>
          <input 
            type="text" 
            placeholder="Search across platform... (CMD+K)"
            className="w-full bg-bg-primary border border-border rounded-xl pl-10 pr-12 py-2 text-sm focus:border-accent-primary outline-none transition-all"
          />
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-border bg-surface px-1.5 font-mono text-[10px] font-medium text-text-muted">
              <Command className="h-3 w-3" /> K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-3">
        {/* Socket Status Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg-primary border border-border text-[10px] font-bold uppercase tracking-wider">
          <div className={cn(
            "h-2 w-2 rounded-full",
            connectionStatus === 'connected' ? "bg-accent-primary animate-pulse shadow-[0_0_8px_rgba(144,165,62,0.5)]" :
            connectionStatus === 'reconnecting' ? "bg-amber-500 animate-bounce" : "bg-red-500"
          )} />
          <span className="text-text-muted hidden sm:inline">{connectionStatus}</span>
        </div>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-xl hover:bg-bg-primary border border-transparent hover:border-border transition-all"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-slate-700" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button className="p-2 rounded-xl hover:bg-bg-primary border border-transparent hover:border-border transition-all relative">
            <Bell className="h-5 w-5 text-text-muted" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border-2 border-surface"></span>
          </button>
        </div>

        {/* Divider */}
        <div className="h-8 w-[1px] bg-border mx-1"></div>

        {/* User Profile */}
        <div className="relative">
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 pl-1 pr-2 py-1 rounded-xl hover:bg-bg-primary transition-all group"
          >
            <div className="h-9 w-9 rounded-full bg-accent-gradient flex items-center justify-center text-white font-bold text-sm border-2 border-surface shadow-sm">
              {adminName.charAt(0)}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold leading-none">{adminName}</p>
              <p className="text-[10px] text-text-muted mt-1 uppercase font-medium">Administrator</p>
            </div>
          </button>

          {/* User Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 glass-card bg-surface shadow-xl py-2 z-50 border border-border overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-bg-primary/50">
                <p className="text-sm font-bold truncate">{adminName}</p>
                <p className="text-xs text-text-muted truncate">{adminEmail}</p>
              </div>
              
              <div className="py-1">
                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-text-muted hover:text-accent-primary hover:bg-accent-primary/5 transition-all">
                  <User className="h-4 w-4" /> Profile Settings
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-text-muted hover:text-accent-primary hover:bg-accent-primary/5 transition-all">
                  <SettingsIcon className="h-4 w-4" /> System Settings
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-text-muted hover:text-accent-primary hover:bg-accent-primary/5 transition-all">
                  <HelpCircle className="h-4 w-4" /> Support Center
                </button>
              </div>

              <div className="border-t border-border mt-1 py-1">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-500/5 transition-all"
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
