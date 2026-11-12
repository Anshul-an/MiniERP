import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface TopbarProps {
  onMenuClick: () => void;
  title?: string;
}

export const Topbar: React.FC<TopbarProps> = ({ onMenuClick, title }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 h-14 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
        >
          <Menu className="h-5 w-5" />
        </button>
        {title && (
          <span className="font-semibold text-gray-800 hidden sm:block">{title}</span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 relative">
          <Bell className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2 text-sm text-gray-600 pl-2 border-l border-gray-200">
          <div className="h-7 w-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <span className="hidden sm:block font-medium">{user?.name}</span>
        </div>
      </div>
    </header>
  );
};
