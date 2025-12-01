
import React, { useMemo } from 'react';
import { User, Role, Channel } from '../types';

interface ChannelListProps {
    currentUser: User;
    channels: Channel[];
    unreadCounts: Record<string, number>;
    activeChannelId: string;
    setActiveChannelId: (id: string) => void;
    onCompose: () => void;
}

const IconComposePencil = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
      <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
      <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
    </svg>
);


const ChannelList: React.FC<ChannelListProps> = ({ currentUser, channels, unreadCounts, activeChannelId, setActiveChannelId, onCompose }) => {
    
    const { generalChannels, departmentChannels, dms } = useMemo(() => {
        const generalChannels = channels.filter(c => c.type === 'channel' && ['general', 'random', 'broadcast'].includes(c.id));
        
        const allDeptChannels = channels.filter(c => c.type === 'channel' && !['general', 'random', 'broadcast'].includes(c.id));
        
        let departmentChannels: Channel[];
        if (currentUser.role === Role.SUPER_ADMIN) {
            departmentChannels = allDeptChannels;
        } else {
            const userDepartmentChannelId = currentUser.department.toLowerCase().replace(/\s+/g, '-');
            departmentChannels = allDeptChannels.filter(c => c.id === userDepartmentChannelId);
        }
        
        const dms = channels.filter(c => c.type === 'dm' && c.members?.includes(currentUser.id)).map(dm => {
            // Find the other user in the DM to display their name
            const otherUserId = dm.members?.find(id => id !== currentUser.id);
            // This part assumes users are passed down or accessible. For simplicity we'll keep the channel name as is.
            // A more robust solution might pass the `users` array to this component.
            return dm;
        });
        
        return { generalChannels, departmentChannels, dms };
    }, [currentUser, channels]);

    const renderChannel = (channel: Channel) => (
        <li key={channel.id}>
            <button
              onClick={() => setActiveChannelId(channel.id)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors flex justify-between items-center ${
                activeChannelId === channel.id
                  ? 'bg-blue-600 text-white'
                  : `text-gray-300 hover:bg-gray-700 hover:text-white ${unreadCounts[channel.id] > 0 ? 'font-bold' : ''}`
              }`}
            >
              <span>{channel.name}</span>
              {unreadCounts[channel.id] > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                    {unreadCounts[channel.id]}
                </span>
              )}
            </button>
        </li>
    );

    return (
      <div className="w-1/4 bg-gray-800 p-4 flex flex-col overflow-y-auto">
        <button onClick={onCompose} className="w-full mb-4 flex items-center justify-center bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <IconComposePencil />
            Compose
        </button>
        <h3 className="text-lg font-semibold text-white mb-4 px-2">Channels</h3>
        <ul className="space-y-1">{generalChannels.map(renderChannel)}</ul>
        
        {departmentChannels.length > 0 && (
            <>
                <h3 className="text-lg font-semibold text-white mt-8 mb-4 px-2">Departments</h3>
                <ul className="space-y-1">{departmentChannels.map(renderChannel)}</ul>
            </>
        )}
        
        <h3 className="text-lg font-semibold text-white mt-8 mb-4 px-2">Direct Messages</h3>
        <ul className="space-y-1">{dms.map(renderChannel)}</ul>
      </div>
    );
};

export default ChannelList;
