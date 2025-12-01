
import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { User, Message, Channel, Role, MessageType, JobPosting } from '../types';
import ChannelList from './ChannelList';
import MessageArea from './MessageArea';
import ComposeModal from './ComposeModal';

interface ChatProps {
  currentUser: User;
  users: User[];
  channels: Channel[];
  messages: Message[];
  unreadCounts: Record<string, number>;
  onSendMessage: (message: Message) => void;
  onChannelView: (channelId: string) => void;
  onChannelCreate: (recipientUser: User) => Channel | null;
  activeChannelId: string;
  setActiveChannelId: (channelId: string) => void;
}

const Chat: React.FC<ChatProps> = ({ currentUser, users, channels, messages, unreadCounts, onSendMessage, onChannelView, onChannelCreate, activeChannelId, setActiveChannelId }) => {
  const [newMessage, setNewMessage] = useState('');
  const [typingStatus, setTypingStatus] = useState<Record<string, string | null>>({});
  const [isSpecialMessagePopupOpen, setSpecialMessagePopupOpen] = useState(false);
  const [isJobModalOpen, setJobModalOpen] = useState(false);
  const [isComposeModalOpen, setComposeModalOpen] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    onChannelView(activeChannelId);
  }, [activeChannelId, onChannelView]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
            setSpecialMessagePopupOpen(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const usersMap = useMemo(() => new Map(users.map(u => [u.id, u])), [users]);
  const activeChannel = useMemo(() => channels.find(c => c.id === activeChannelId), [activeChannelId, channels]);
  const channelMessages = useMemo(() => messages.filter(m => m.channelId === activeChannelId), [messages, activeChannelId]);

  const handleSendMessage = useCallback((content: string | JobPosting, type: MessageType, channelId: string) => {
    // Check if content is a string and empty, AND doesn't contain the attachment placeholder.
    if (typeof content === 'string' && content.trim() === '' && !content.includes('[attachment]')) return;

    const message: Message = {
      id: Date.now(),
      userId: currentUser.id,
      channelId: channelId,
      content: content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type,
    };
    onSendMessage(message);
    setNewMessage('');

    if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
    }
    setTypingStatus(prev => ({ ...prev, [channelId]: null }));
  }, [currentUser.id, onSendMessage]);
  
  const handleFormSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' && !attachment) return;

    let messageContent = newMessage.trim();
    if (attachment) {
      const isImage = attachment.type.startsWith('image/');
      const uniqueFileName = `${Date.now()}-${attachment.name}`;
      const urlPath = isImage ? '/img/simulated/' : '/docs/simulated/';
      const attachmentUrl = `${urlPath}${uniqueFileName}`;
      messageContent += `${messageContent ? '\n\n' : ''}[attachment]${attachmentUrl}[/attachment]`;
    }
    
    const isDepartmentChannel = activeChannel?.id === currentUser.department.toLowerCase().replace(/\s+/g, '-');
    const isAdmin = currentUser.role === Role.ADMIN;
    const isSuperAdminInBroadcast = currentUser.role === Role.SUPER_ADMIN && activeChannelId === 'broadcast';

    const type = (isAdmin && isDepartmentChannel) || isSuperAdminInBroadcast 
        ? MessageType.ANNOUNCEMENT 
        : MessageType.STANDARD;

    handleSendMessage(messageContent, type, activeChannelId);
    
    setAttachment(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  }, [newMessage, attachment, activeChannel, activeChannelId, currentUser, handleSendMessage]);

  const handleSendJobPosting = useCallback((jobData: JobPosting) => {
    handleSendMessage(jobData, MessageType.JOB_POSTING, activeChannelId);
  }, [handleSendMessage, activeChannelId]);
  
  const handleTyping = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
    
    if (activeChannel?.type === 'dm') {
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        const otherUserId = activeChannel.members?.find(id => id !== currentUser.id);
        if (otherUserId) {
            const otherUser = usersMap.get(otherUserId);
            if (otherUser) {
                setTypingStatus(prev => ({ ...prev, [activeChannelId]: `${otherUser.firstName} ${otherUser.fatherName}` }));

                typingTimeoutRef.current = setTimeout(() => {
                    setTypingStatus(prev => ({ ...prev, [activeChannelId]: null }));
                }, 2000);
            }
        }
    }
  }, [activeChannel, currentUser.id, usersMap, activeChannelId]);

  const handleComposeSubmit = ({ email, subject, message }: { email: string, subject: string, message: string }) => {
      const recipient = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!recipient) {
          alert('User with that email address not found.');
          return;
      }
      if (recipient.id === currentUser.id) {
          alert("You can't send a message to yourself.");
          return;
      }

      const channel = onChannelCreate(recipient);
      if (channel) {
          const fullMessage = subject ? `**Subject: ${subject}**\n\n${message}` : message;
          handleSendMessage(fullMessage, MessageType.STANDARD, channel.id);
          setActiveChannelId(channel.id);
          setComposeModalOpen(false);
      }
  };


    const isBroadcastChannel = activeChannel?.id === 'broadcast';
    const isDepartmentChannel = activeChannel?.id === currentUser.department.toLowerCase().replace(/\s+/g, '-');
    
    const canPostToBroadcast = currentUser.role === Role.SUPER_ADMIN;
    const canPostSpecialInDept = currentUser.role === Role.ADMIN && isDepartmentChannel;
    const canPostSpecialAsSuperAdmin = currentUser.role === Role.SUPER_ADMIN && (activeChannel?.type === 'channel' && !['general', 'random'].includes(activeChannelId));

    const canPostSpecial = canPostSpecialInDept || canPostSpecialAsSuperAdmin;
    const isInputDisabled = isBroadcastChannel && !canPostToBroadcast;
    const placeholderText = isInputDisabled 
      ? `Only Super Admins can post in broadcast` 
      : `Message ${activeChannel?.name}`;
      
  return (
    <div className="bg-gray-900 text-white h-full rounded-xl shadow-lg flex overflow-hidden">
      <ComposeModal 
        isOpen={isComposeModalOpen}
        onClose={() => setComposeModalOpen(false)}
        onSubmit={handleComposeSubmit}
        users={users}
        currentUser={currentUser}
      />
      <ChannelList 
        currentUser={currentUser}
        channels={channels}
        unreadCounts={unreadCounts}
        activeChannelId={activeChannelId}
        setActiveChannelId={setActiveChannelId}
        onCompose={() => setComposeModalOpen(true)}
      />
      <MessageArea 
        activeChannel={activeChannel}
        channelMessages={channelMessages}
        currentUser={currentUser}
        usersMap={usersMap}
        users={users}
        typingStatus={typingStatus}
        newMessage={newMessage}
        attachment={attachment}
        setAttachment={setAttachment}
        fileInputRef={fileInputRef}
        handleTyping={handleTyping}
        handleFormSubmit={handleFormSubmit}
        isInputDisabled={isInputDisabled}
        placeholderText={placeholderText}
        canPostSpecial={canPostSpecial}
        isSpecialMessagePopupOpen={isSpecialMessagePopupOpen}
        setSpecialMessagePopupOpen={setSpecialMessagePopupOpen}
        popupRef={popupRef}
        isJobModalOpen={isJobModalOpen}
        setJobModalOpen={setJobModalOpen}
        handleSendJobPosting={handleSendJobPosting}
      />
    </div>
  );
};

export default Chat;