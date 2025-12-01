
import React from 'react';
import { User } from '../types';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  onEditProfile: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, onEditProfile }) => {
  return (
    <header className="bg-white dark:bg-gray-900 shadow-md h-20 flex-shrink-0 flex items-center justify-between px-6 md:px-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">EriPro Connect</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Your integrated professional workspace.</p>
      </div>
      <div className="flex items-center space-x-2 md:space-x-4">
        <button onClick={onEditProfile} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors" aria-label="Edit your profile">
          <div className="text-right hidden sm:block">
            <p className="font-semibold text-gray-800 dark:text-gray-200">{user.firstName} {user.fatherName}</p>
            <p className="text-sm text-blue-500 dark:text-blue-400">{user.role}</p>
          </div>
          <div className="relative group">
            <img src={user.avatarUrl} alt={`${user.firstName} ${user.fatherName}`} className="w-12 h-12 rounded-full border-2 border-blue-500 object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center rounded-full transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white opacity-0 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>
            </div>
          </div>
        </button>
        <button
          onClick={onLogout}
          className="p-2 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          aria-label="Logout"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;