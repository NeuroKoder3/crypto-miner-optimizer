import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Activity, 
  Save, 
  Cpu,
  Menu,
  X,
  Zap,
  Settings2,
  Brain,
  Book
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navigation = [
  { name: 'Dashboard', href: 'Dashboard', icon: LayoutDashboard },
  { name: 'Coin Switch AI', href: 'CoinSwitch', icon: Brain },
  { name: 'AI Model', href: 'AIModel', icon: Cpu },
  { name: 'Automation', href: 'Automation', icon: Settings2 },
  { name: 'Benchmarks', href: 'Benchmarks', icon: Activity },
  { name: 'Profiles', href: 'Profiles', icon: Save },
];

function NavLink({ item, currentPage, onClick }) {
  const isActive = currentPage === item.href;
  
  return (
    <Link
      to={createPageUrl(item.href)}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
        isActive 
          ? "bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 text-white border border-cyan-500/30" 
          : "text-slate-400 hover:text-white hover:bg-slate-800/50"
      )}
    >
      <item.icon className={cn("w-4 h-4", isActive && "text-cyan-400")} />
      {item.name}
    </Link>
  );
}

export default function Layout({ children, currentPageName }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 z-50">
        <div className="flex flex-col flex-1 bg-gradient-to-b from-slate-900/95 to-slate-950/95 border-r border-slate-800/50 backdrop-blur-xl">
          {/* Logo */}
          <div className="p-6 border-b border-slate-800/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-white">CMO</h1>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">Mining Optimizer</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => (
              <NavLink key={item.name} item={item} currentPage={currentPageName} />
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-800/50 space-y-2">
            <Link
              to={createPageUrl('Guides')}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-slate-400 hover:text-white hover:bg-slate-800/50"
            >
              <Book className="w-4 h-4" />
              Guides & Tutorials
            </Link>
            <div className="p-3 rounded-xl bg-slate-800/30 border border-slate-700/30">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs text-slate-400">System Status</span>
              </div>
              <p className="text-[10px] text-slate-500">All systems operational</p>
              <p className="text-[10px] text-slate-600 mt-1">v1.0.0 • Offline Mode</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900/95 border-b border-slate-800/50 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-cyan-500 to-emerald-500">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white">CMO</span>
          </div>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-slate-400">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-slate-900 border-slate-800 p-0">
              <div className="p-6 border-b border-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="font-bold text-white">CMO</h1>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Mining Optimizer</p>
                  </div>
                </div>
              </div>
              <nav className="p-4 space-y-1">
                {navigation.map((item) => (
                  <NavLink 
                    key={item.name} 
                    item={item} 
                    currentPage={currentPageName}
                    onClick={() => setMobileOpen(false)}
                  />
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0">
        {children}
      </main>
    </div>
  );
}