
import { Link, useLocation } from 'react-router-dom';
import { Users, CreditCard, BarChart, Settings, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { name: 'Dashboard', path: '/', icon: BarChart },
    { name: 'Members', path: '/members', icon: Users },
    { name: 'Memberships', path: '/memberships', icon: CreditCard },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Mobile sidebar backdrop */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden transition-opacity duration-200 ${isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        onClick={() => setIsCollapsed(true)}
      />
      
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed top-0 left-0 z-30 h-screen bg-white border-r border-gray-200 transition-all duration-300 lg:static lg:translate-x-0",
          isCollapsed ? "-translate-x-full" : "translate-x-0",
          "w-64 lg:w-64"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gym-purple flex items-center justify-center">
              <span className="text-white font-bold text-sm">GS</span>
            </div>
            <span className="text-xl font-bold text-gray-800">GymSpark</span>
          </Link>
          <button 
            onClick={toggleSidebar}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path || 
                             (item.path !== '/' && location.pathname.startsWith(item.path));
              
              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`flex items-center p-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-gym-light-purple text-gym-dark-purple font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon size={20} className={isActive ? 'text-gym-purple' : 'text-gray-500'} />
                    <span className="ml-3">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
      
      {/* Mobile toggle button */}
      <button
        onClick={toggleSidebar}
        className="fixed bottom-4 right-4 lg:hidden z-30 bg-gym-purple text-white p-3 rounded-full shadow-lg"
      >
        <Menu size={24} />
      </button>
    </>
  );
};

export default Sidebar;
