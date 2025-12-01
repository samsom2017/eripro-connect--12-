
import React from 'react';
import { Role } from '../types';

interface SidebarProps {
  userRole: Role;
  activeView: string;
  setActiveView: (view: 'dashboard' | 'users' | 'chat') => void;
  canViewUserManagement: boolean;
  unreadCount: number;
}

const IconDashboard = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const IconUsers = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197" /></svg>;
const IconChat = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;

const NavItem: React.FC<{ icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void; badgeCount?: number; }> = ({ icon, label, isActive, onClick, badgeCount = 0 }) => (
  <li
    onClick={onClick}
    className={`relative flex items-center p-3 my-1 rounded-lg cursor-pointer transition-colors duration-200 ${
      isActive
        ? 'bg-blue-600 text-white shadow-lg'
        : 'text-gray-400 hover:bg-gray-700 hover:text-white'
    }`}
  >
    {icon}
    <span className="ml-4 font-medium">{label}</span>
    {badgeCount > 0 && (
      <span className="absolute top-2 right-2 flex items-center justify-center min-w-[20px] h-5 px-1 text-xs font-bold text-white bg-red-500 rounded-full">
        {badgeCount > 9 ? '9+' : badgeCount}
      </span>
    )}
  </li>
);

const Sidebar: React.FC<SidebarProps> = ({ userRole, activeView, setActiveView, canViewUserManagement, unreadCount }) => {
  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col p-4 shadow-2xl">
      <div className="flex items-center mb-8 border-b border-gray-700 pb-4">
        <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          EriPro
        </div>
        <span className="ml-2 font-semibold text-2xl text-white">Connect</span>
      </div>
      <nav className="flex-1">
        <ul>
          <NavItem
            icon={<IconDashboard />}
            label="Dashboard"
            isActive={activeView === 'dashboard'}
            onClick={() => setActiveView('dashboard')}
          />
          <NavItem
            icon={<IconChat />}
            label="Inbox"
            isActive={activeView === 'chat'}
            onClick={() => setActiveView('chat')}
            badgeCount={unreadCount}
          />
          {canViewUserManagement && (
            <NavItem
              icon={<IconUsers />}
              label="User Management"
              isActive={activeView === 'users'}
              onClick={() => setActiveView('users')}
            />
          )}
        </ul>
      </nav>
      <div className="mt-auto text-center text-gray-500 text-xs">
        <p>&copy; 2024 EriPro Inc.</p>
        <p>Version 1.0.0</p>
      </div>
    </aside>
  );
};

export default Sidebar;
