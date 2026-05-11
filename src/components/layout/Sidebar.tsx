import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserRoundCheck, 
  Map, 
  Key, 
  Briefcase, 
  Package, 
  Truck, 
  CreditCard, 
  Wallet, 
  ShoppingCart, 
  FileText, 
  MessageSquare, 
  Sprout, 
  BarChart3, 
  Bot, 
  Smartphone, 
  Bell, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useLocation } from 'react-router-dom';

interface SidebarItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isCollapsed: boolean;
}

const SidebarItem = ({ to, icon: Icon, label, isCollapsed }: SidebarItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));

  return (
    <NavLink
      to={to}
      className={cn(
        "flex items-center gap-3 px-4 py-2.5 my-1 mx-2 rounded-xl transition-all duration-300 relative group",
        "text-text-muted hover:text-accent-primary hover:bg-accent-primary/5",
        isActive && "text-accent-primary bg-accent-primary/10 font-bold shadow-sm shadow-accent-primary/5"
      )}
    >
      <Icon className={cn("h-5 w-5 min-w-[20px] transition-transform duration-300", isActive && "scale-110")} strokeWidth={isActive ? 2.5 : 1.5} />
      <span className={cn(
        "font-medium whitespace-nowrap transition-all duration-300 origin-left",
        isCollapsed ? "opacity-0 scale-0 w-0" : "opacity-100 scale-100"
      )}>
        {label}
      </span>
      
      {isCollapsed && (
        <div className="absolute left-full ml-4 px-3 py-2 bg-text-primary text-surface text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0 pointer-events-none z-50 shadow-xl border border-border whitespace-nowrap">
          {label}
        </div>
      )}
    </NavLink>
  );
};


const Sidebar = ({ isCollapsed, setIsCollapsed }: { isCollapsed: boolean, setIsCollapsed: (val: boolean) => void }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const sections = [
    {
      title: "Main",
      items: [
        { to: "/", icon: LayoutDashboard, label: "Dashboard" },
        { to: "/analytics", icon: BarChart3, label: "Analytics" },
      ]
    },
    {
      title: "Management",
      items: [
        { to: "/users", icon: Users, label: "Users" },
        { to: "/workers", icon: UserRoundCheck, label: "Workers & KYC" },
        { to: "/lands", icon: Map, label: "Lands" },
        { to: "/land-rentals", icon: Key, label: "Land Rentals" },
      ]
    },
    {
      title: "Operations",
      items: [
        { to: "/jobs", icon: Briefcase, label: "Job Requests" },
        { to: "/orders", icon: ShoppingCart, label: "Orders" },
        { to: "/deliveries", icon: Truck, label: "Deliveries" },
        { to: "/products", icon: Package, label: "Products" },
        { to: "/crop-plans", icon: Sprout, label: "Crop Plans" },
      ]
    },
    {
      title: "Financial",
      items: [
        { to: "/transactions", icon: CreditCard, label: "Transactions" },
        { to: "/wallets", icon: Wallet, label: "Worker Wallets" },
      ]
    },
    {
      title: "System",
      items: [
        { to: "/contracts", icon: FileText, label: "Contracts" },
        { to: "/feedbacks", icon: MessageSquare, label: "Feedbacks" },
        { to: "/ai-sessions", icon: Bot, label: "AI Sessions" },
        { to: "/devices", icon: Smartphone, label: "Devices" },
        { to: "/notifications", icon: Bell, label: "Notifications" },
        { to: "/settings", icon: Settings, label: "Settings" },
      ]
    }
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-accent-gradient text-white shadow-lg shadow-accent-primary/40 z-50 flex items-center justify-center lg:hidden transition-all active:scale-90"
      >
        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside 
        className={cn(
          "fixed left-0 top-0 h-full bg-surface border-r border-border transition-all duration-300 z-40",
          "lg:translate-x-0",
          isMobileMenuOpen ? "translate-x-0 w-[280px]" : "-translate-x-full lg:translate-x-0",
          isCollapsed && !isMobileMenuOpen ? "lg:w-20" : "lg:w-[260px]"
        )}
      >
        {/* Desktop Toggle Button - Positioned on border, outside overflow area */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -right-3 top-7 h-6 w-6 rounded-full bg-surface border border-border items-center justify-center text-text-muted hover:text-accent-primary hover:border-accent-primary shadow-sm transition-all z-[60] group hover:scale-110 active:scale-95"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>

        <div className="flex flex-col h-full overflow-hidden">

        {/* Header */}
        <div className="h-20 flex items-center justify-between px-4 sticky top-0 bg-surface z-10">
          <div className={cn(
            "flex items-center gap-3 transition-all duration-300",
            isCollapsed && !isMobileMenuOpen ? "opacity-0 translate-x-[-20px] scale-0 w-0" : "opacity-100 translate-x-0 scale-100"
          )}>
            <div className="bg-[#1A2315] p-2 rounded-xl border border-accent-primary/20 shadow-inner">
              <img src="/assets/logo-app-no-bg.png" alt="Logo" className="h-7 w-auto" />
            </div>
            <span className="font-sora font-extrabold text-xl tracking-tight text-text-primary">Farmy</span>
          </div>

          {isCollapsed && !isMobileMenuOpen && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <div className="bg-[#1A2315] p-2 rounded-xl border border-accent-primary/20 shadow-lg">
                <img src="/assets/logo-app-no-bg.png" alt="Logo" className="h-7 w-auto" />
               </div>
            </div>
          )}
        </div>





      {/* Navigation */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-4">

        {sections.map((section, idx) => (
          <div key={idx} className="mb-4">
            {!isCollapsed && (
              <h3 className="px-8 py-2 text-[10px] uppercase font-bold text-text-muted tracking-widest opacity-60">
                {section.title}
              </h3>
            )}
            {isCollapsed && <div className="h-[1px] bg-border mx-6 my-4 opacity-50" />}
            {section.items.map((item, itemIdx) => (
              <SidebarItem 
                key={itemIdx} 
                to={item.to} 
                icon={item.icon} 
                label={item.label} 
                isCollapsed={isCollapsed} 
              />
            ))}
          </div>
        ))}
      </div>
        </div>
      </aside>

    </>
  );
};

export default Sidebar;
