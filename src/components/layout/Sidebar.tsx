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
  Menu
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface SidebarItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isCollapsed: boolean;
}

const SidebarItem = ({ to, icon: Icon, label, isCollapsed }: SidebarItemProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => cn(
        "flex items-center gap-3 px-4 py-3 my-1 transition-all duration-300 relative group",
        "hover:bg-accent-primary/5 text-text-muted hover:text-accent-primary",
        isActive && "text-accent-primary bg-accent-primary/8 border-l-[3px] border-accent-primary"
      )}
    >
      <Icon className="h-5 w-5 min-w-[20px]" strokeWidth={1.5} />
      {!isCollapsed && <span className="font-medium whitespace-nowrap">{label}</span>}
      
      {isCollapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-dark-surface text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
          {label}
        </div>
      )}
    </NavLink>
  );
};

const Sidebar = ({ isCollapsed, setIsCollapsed }: { isCollapsed: boolean, setIsCollapsed: (val: boolean) => void }) => {
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
    <aside 
      className={cn(
        "fixed left-0 top-0 h-full bg-surface border-r border-border transition-all duration-300 z-40 overflow-y-auto overflow-x-hidden",
        isCollapsed ? "w-16" : "w-[260px]"
      )}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border sticky top-0 bg-surface z-10">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="bg-[#1A2315] p-1.5 rounded-lg border border-accent-primary/20">
              <img src="/assets/logo-app-no-bg.png" alt="Logo" className="h-6 w-auto" />
            </div>
            <span className="font-sora font-bold text-lg text-accent-primary">Farmy</span>
          </div>
        )}
        {isCollapsed && (
          <img src="/assets/logo-app-no-bg.png" alt="Logo" className="h-8 w-auto mx-auto p-1 bg-[#1A2315] rounded-md" />
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg hover:bg-border transition-colors ml-2"
        >
          {isCollapsed ? <Menu className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>

      {/* Navigation */}
      <div className="py-4">
        {sections.map((section, idx) => (
          <div key={idx} className="mb-4">
            {!isCollapsed && (
              <h3 className="px-6 py-2 text-[10px] uppercase font-bold text-text-muted tracking-widest">
                {section.title}
              </h3>
            )}
            {isCollapsed && <div className="h-[1px] bg-border mx-4 my-2" />}
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
    </aside>
  );
};

export default Sidebar;
