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
import { useNotifications } from '../../api/hooks/useNotifications';
import { useClickOutside } from '../../hooks/useClickOutside';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

const Topbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { connectionStatus } = useSocketContext();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const userMenuRef = useClickOutside(() => setShowUserMenu(false));
  const notificationsRef = useClickOutside(() => setShowNotifications(false));
  
  const { data: notificationsData, markAsRead, markAllAsRead } = useNotifications();
  const notifications = notificationsData?.data || [];
  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  
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
        <div className="relative" ref={notificationsRef as any}>
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className={cn(
              "p-2 rounded-xl border border-transparent hover:border-border transition-all relative",
              showNotifications ? "bg-bg-primary border-border text-accent-primary" : "hover:bg-bg-primary text-text-muted"
            )}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-4 min-w-[16px] px-1 bg-red-500 rounded-full border-2 border-surface text-[8px] font-bold text-white flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-surface dark:bg-dark-bg shadow-2xl py-0 z-50 border border-border rounded-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 opacity-100">
              <div className="px-4 py-3 border-b border-border bg-bg-primary/50 flex items-center justify-between">
                <h4 className="text-sm font-bold">Notifications</h4>
                {unreadCount > 0 && (
                  <button 
                    onClick={() => markAllAsRead()}
                    className="text-[10px] font-bold text-accent-primary hover:underline uppercase"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              
              <div className="max-h-[350px] overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.slice(0, 5).map((notification: any) => (
                    <div 
                      key={notification.id}
                      onClick={() => !notification.isRead && markAsRead(notification.id)}
                      className={cn(
                        "px-4 py-3 border-b border-border/50 last:border-0 hover:bg-bg-primary transition-all cursor-pointer relative",
                        !notification.isRead && "bg-accent-primary/[0.02]"
                      )}
                    >
                      {!notification.isRead && (
                        <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1 h-8 bg-accent-primary rounded-full" />
                      )}
                      <div className="flex gap-3">
                        <div className="h-8 w-8 rounded-lg bg-bg-primary flex items-center justify-center shrink-0">
                          <Bell className={cn("h-4 w-4", !notification.isRead ? "text-accent-primary" : "text-text-muted")} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn("text-xs leading-normal", !notification.isRead ? "font-bold text-text-primary" : "text-text-secondary")}>
                            {notification.title}
                          </p>
                          <p className="text-[10px] text-text-muted mt-0.5 line-clamp-2 leading-relaxed">
                            {notification.message}
                          </p>
                          <p className="text-[9px] text-text-muted mt-1 font-medium">
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center">
                    <div className="h-12 w-12 rounded-full bg-bg-primary flex items-center justify-center mx-auto mb-3">
                      <Bell className="h-6 w-6 text-text-muted opacity-20" />
                    </div>
                    <p className="text-xs text-text-muted">No new notifications</p>
                  </div>
                )}
              </div>

              <Link 
                to="/notifications"
                onClick={() => setShowNotifications(false)}
                className="block py-3 text-center text-xs font-bold text-text-muted hover:text-accent-primary hover:bg-bg-primary transition-all border-t border-border"
              >
                See all notifications
              </Link>
            </div>
          )}
        </div>


        {/* Divider */}
        <div className="h-8 w-[1px] bg-border mx-1"></div>

        {/* User Profile */}
        <div className="relative" ref={userMenuRef as any}>
          <button 
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
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
            <div className="absolute right-0 mt-3 w-64 bg-surface dark:bg-dark-bg shadow-2xl py-0 z-50 border border-border rounded-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 opacity-100">
              <div className="px-4 py-5 bg-accent-gradient relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-white -mr-12 -mt-12" />
                  <div className="absolute bottom-0 left-0 h-12 w-12 rounded-full bg-white -ml-6 -mb-6" />
                </div>
                
                <div className="relative flex flex-col items-center text-center">
                  <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white text-2xl font-bold shadow-lg mb-3">
                    {adminName.charAt(0)}
                  </div>
                  <p className="text-sm font-bold text-white truncate w-full">{adminName}</p>
                  <p className="text-[10px] text-white/80 truncate w-full mt-0.5">{adminEmail}</p>
                </div>
              </div>
              
              <div className="p-2 space-y-1">
                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-text-muted hover:text-accent-primary hover:bg-accent-primary/5 rounded-xl transition-all group">
                  <div className="h-8 w-8 rounded-lg bg-bg-primary flex items-center justify-center group-hover:bg-accent-primary/10 transition-all">
                    <User className="h-4 w-4" />
                  </div>
                  Profile Settings
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-text-muted hover:text-accent-primary hover:bg-accent-primary/5 rounded-xl transition-all group">
                  <div className="h-8 w-8 rounded-lg bg-bg-primary flex items-center justify-center group-hover:bg-accent-primary/10 transition-all">
                    <SettingsIcon className="h-4 w-4" />
                  </div>
                  System Settings
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-text-muted hover:text-accent-primary hover:bg-accent-primary/5 rounded-xl transition-all group">
                  <div className="h-8 w-8 rounded-lg bg-bg-primary flex items-center justify-center group-hover:bg-accent-primary/10 transition-all">
                    <HelpCircle className="h-4 w-4" />
                  </div>
                  Support Center
                </button>
              </div>

              <div className="p-2 border-t border-border mt-1 bg-bg-primary/30">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-rose-500 hover:bg-rose-500/5 rounded-xl transition-all group"
                >
                  <div className="h-8 w-8 rounded-lg bg-rose-500/10 flex items-center justify-center group-hover:bg-rose-500/20 transition-all">
                    <LogOut className="h-4 w-4" />
                  </div>
                  Sign Out of Platform
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
