
import React, { useState, useCallback, useEffect } from 'react';
import { USERS, ROLE_HIERARCHY, CHANNELS as INITIAL_CHANNELS, MESSAGES, PRODUCTIVITY_ITEMS } from './constants';
import { User as UserType, Role, Department, Message, MessageType, ProductivityItem, Channel, JobPosting } from './types';
import LandingPage from './components/LoginScreen';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import UserManagement from './components/UserManagement';
import Chat from './components/Chat';
import ProfileModal from './components/ProfileModal';

type View = 'dashboard' | 'users' | 'chat';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [users, setUsers] = useState<UserType[]>(USERS);
  const [messages, setMessages] = useState<Message[]>(MESSAGES);
  const [channels, setChannels] = useState<Channel[]>(INITIAL_CHANNELS);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [productivityItems, setProductivityItems] = useState<ProductivityItem[]>(PRODUCTIVITY_ITEMS);
  const [activeChannelId, setActiveChannelId] = useState<string>('general');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    if (currentUser && 'Notification' in window) {
      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('EriPro Connect', {
              body: 'Notifications have been enabled!',
              icon: 'https://picsum.photos/id/1/100/100' // A generic icon
            });
          }
        });
      }
    }
  }, [currentUser]);


  useEffect(() => {
    if (!currentUser) return;

    const interval = setInterval(() => {
      const userChannels = channels.filter(c => {
        return (c.type === 'dm' && c.members?.includes(currentUser.id)) ||
               (c.type === 'channel' && !c.isBroadcast && c.id !== 'random' && c.id !== 'general') || 
               (c.id === currentUser.department.toLowerCase().replace(/\s+/g, '-'));
      });
      if (userChannels.length === 0) return;

      const targetChannel = userChannels[Math.floor(Math.random() * userChannels.length)];
      
      const potentialSenders = users.filter(u => u.id !== currentUser.id && u.department === currentUser.department);
       if (potentialSenders.length === 0) return;
      const sender = potentialSenders[Math.floor(Math.random() * potentialSenders.length)];

      const newMessage: Message = {
        id: Date.now(),
        userId: sender.id,
        channelId: targetChannel.id,
        content: `This is a simulated message at ${new Date().toLocaleTimeString()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: MessageType.STANDARD,
      };

      setMessages(prev => [...prev, newMessage]);
      
      if(targetChannel.id !== activeChannelId) {
        setUnreadCounts(prev => ({
          ...prev,
          [targetChannel.id]: (prev[targetChannel.id] || 0) + 1,
        }));
      }

      if (Notification.permission === 'granted' && document.hidden) {
        const title = newMessage.type === MessageType.ANNOUNCEMENT
            ? `📢 Announcement in ${targetChannel.name}`
            : `New message from ${sender?.firstName} ${sender?.fatherName}`;
        
        const body = typeof newMessage.content === 'string'
            ? newMessage.content
            : (newMessage.content as JobPosting).title;

        // FIX: Removed non-standard `renotify` property which causes a TypeScript error.
        const notification = new Notification(title, {
            body,
            icon: sender?.avatarUrl,
            tag: targetChannel.id, // Using tag to prevent spamming notifications for the same chat
        });

        notification.onclick = () => {
            window.focus();
            setActiveView('chat');
            setActiveChannelId(targetChannel.id);
        };
      }

    }, 15000); // 15 seconds

    return () => clearInterval(interval);
  }, [currentUser, users, channels, activeChannelId]);


  const handleLogin = useCallback((credentials: { email: string; password: string }) => {
    const user = users.find(u => u.email.toLowerCase() === credentials.email.toLowerCase());
    if (user && user.password === credentials.password) {
        setCurrentUser(user);
        setActiveView('dashboard');
    } else {
        alert('Invalid email or password.');
    }
  }, [users]);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const handleRegister = useCallback((newUser: Omit<UserType, 'id' | 'role' | 'avatarUrl'>) => {
    setUsers(prevUsers => {
        if (prevUsers.some(u => u.email.toLowerCase() === newUser.email.toLowerCase())) {
            alert("An account with this email already exists.");
            return prevUsers;
        }
        const newUserWithDefaults: UserType = {
            ...newUser,
            id: Math.max(0, ...prevUsers.map(u => u.id)) + 1,
            role: Role.USER,
            avatarUrl: `https://picsum.photos/seed/${Date.now()}/100/100`,
        };
        return [...prevUsers, newUserWithDefaults];
    });
  }, []);
  
  const handleCreateUser = useCallback((user: Omit<UserType, 'id' | 'avatarUrl' | 'password'>) => {
    setUsers(prevUsers => {
        const newUserWithDefaults: UserType = {
            ...user,
            id: Math.max(0, ...prevUsers.map(u => u.id)) + 1,
            avatarUrl: `https://picsum.photos/seed/${Date.now()}/100/100`,
            password: 'password123' // Default password for admin-created users
        };
        return [...prevUsers, newUserWithDefaults];
    });
  }, []);


  const handleUpdateUser = useCallback((updatedUser: UserType) => {
    setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? { ...u, ...updatedUser } : u));
    if (currentUser && currentUser.id === updatedUser.id) {
        setCurrentUser(prev => ({...prev, ...updatedUser}));
    }
  }, [currentUser]);

  const handleDeleteUser = useCallback((userId: number) => {
    if (currentUser?.id === userId) {
        alert("You cannot delete your own account.");
        return;
    }
    setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
  }, [currentUser]);

  const handleSendMessage = useCallback((message: Message) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const handleChannelView = useCallback((channelId: string) => {
    setUnreadCounts(prev => {
        if (!prev[channelId]) return prev;
        const newCounts = { ...prev };
        delete newCounts[channelId];
        return newCounts;
    });
  }, []);
  
  const handleCreateDmChannel = useCallback((recipientUser: UserType): Channel | null => {
    if (!currentUser) return null;
    
    // Check for existing DM channel
    const existingChannel = channels.find(c => 
        c.type === 'dm' && 
        c.members?.length === 2 &&
        c.members?.includes(currentUser.id) && 
        c.members?.includes(recipientUser.id)
    );
    if (existingChannel) return existingChannel;

    // Create a new one
    const newChannel: Channel = {
        id: `dm-${currentUser.id}-${recipientUser.id}-${Date.now()}`,
        name: `${recipientUser.firstName} ${recipientUser.fatherName}`,
        type: 'dm',
        members: [currentUser.id, recipientUser.id],
    };
    setChannels(prev => [...prev, newChannel]);
    return newChannel;
  }, [channels, currentUser]);


  const handleAddProductivityItem = useCallback((item: Omit<ProductivityItem, 'id'>) => {
    setProductivityItems(prev => [...prev, { ...item, id: `item-${Date.now()}` }]);
  }, []);

  const handleUpdateProductivityItem = useCallback((updatedItem: ProductivityItem) => {
    setProductivityItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
  }, []);
  
  const handleDeleteProductivityItem = useCallback((itemId: string) => {
    setProductivityItems(prev => prev.filter(item => item.id !== itemId));
  }, []);

  const canViewUserManagement = currentUser && ROLE_HIERARCHY[currentUser.role] >= ROLE_HIERARCHY['Admin'];

  // FIX: Explicitly type accumulator and value in reduce to avoid potential type inference issues.
  const totalUnreadCount = Object.values(unreadCounts).reduce((sum: number, count: number) => sum + count, 0);

  const renderContent = () => {
    if (!currentUser) return null;
    switch (activeView) {
      case 'dashboard':
        return <Dashboard 
            currentUser={currentUser} 
            productivityItems={productivityItems}
            onAddItem={handleAddProductivityItem}
            onUpdateItem={handleUpdateProductivityItem}
            onDeleteItem={handleDeleteProductivityItem}
        />;
      case 'users':
        return canViewUserManagement ? (
            <UserManagement 
                currentUser={currentUser} 
                users={users}
                onCreateUser={handleCreateUser}
                onUpdateUser={handleUpdateUser}
                onDeleteUser={handleDeleteUser}
            />
        ) : <Dashboard 
            currentUser={currentUser} 
            productivityItems={productivityItems}
            onAddItem={handleAddProductivityItem}
            onUpdateItem={handleUpdateProductivityItem}
            onDeleteItem={handleDeleteProductivityItem}
        />;
      case 'chat':
        return <Chat 
            currentUser={currentUser} 
            users={users} 
            channels={channels}
            messages={messages}
            unreadCounts={unreadCounts}
            onSendMessage={handleSendMessage}
            onChannelView={handleChannelView}
            onChannelCreate={handleCreateDmChannel}
            activeChannelId={activeChannelId}
            setActiveChannelId={setActiveChannelId}
        />;
      default:
        return <Dashboard 
            currentUser={currentUser}
            productivityItems={productivityItems}
            onAddItem={handleAddProductivityItem}
            onUpdateItem={handleUpdateProductivityItem}
            onDeleteItem={handleDeleteProductivityItem}
        />;
    }
  };

  if (!currentUser) {
    return <LandingPage onLogin={handleLogin} onRegister={handleRegister} />;
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Sidebar 
        userRole={currentUser.role} 
        activeView={activeView} 
        setActiveView={setActiveView} 
        canViewUserManagement={canViewUserManagement}
        unreadCount={totalUnreadCount}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={currentUser} onLogout={handleLogout} onEditProfile={() => setIsProfileModalOpen(true)} />
        {isProfileModalOpen && (
            <ProfileModal 
              isOpen={isProfileModalOpen}
              onClose={() => setIsProfileModalOpen(false)}
              currentUser={currentUser}
              onUpdateUser={handleUpdateUser}
            />
        )}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 dark:bg-gray-800 p-6 md:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;