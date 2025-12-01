
import React, { useRef, useEffect } from 'react';
import { User, Message, Channel, MessageType, JobPosting } from '../types';


const IconAnnouncement = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 2a6 6 0 00-6 6v3.586l-1.707 1.707A1 1 0 003 15h14a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
    </svg>
);

const IconBriefcase = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 2a2 2 0 00-2 2v1H6a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2V4a2 2 0 00-2-2zm-1 2V4a1 1 0 112 0v1h-2zM6 7v8h8V7H6z" clipRule="evenodd" />
    </svg>
);

const renderMessageContent = (text: string) => {
    const attachmentRegex = /\[attachment\](.+?)\[\/attachment\]/g;

    const parts: (string | { type: 'attachment'; url: string; isImage: boolean })[] = [];
    let lastIndex = 0;
    let match;

    while ((match = attachmentRegex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            parts.push(text.substring(lastIndex, match.index).trim());
        }
        
        const url = match[1];
        const isImage = /\.(jpg|jpeg|png|gif)$/i.test(url) || url.startsWith('/img/simulated/');
        
        parts.push({ type: 'attachment', url, isImage });
        
        lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex).trim());
    }

    return parts.filter(part => part).map((part, index) => {
        if (typeof part === 'string') {
            return <p key={index} className="whitespace-pre-wrap break-words">{part}</p>;
        }

        if (part.type === 'attachment') {
            if (part.isImage) {
                 const imageUrl = part.url.startsWith('/img/simulated/') ? `https://picsum.photos/seed/${part.url.split('/').pop()}/400/300` : part.url;
                return (
                    <a key={index} href={imageUrl} target="_blank" rel="noopener noreferrer" className="block mt-2">
                        <img src={imageUrl} alt="User attachment" className="max-w-xs rounded-lg cursor-pointer border border-gray-600" />
                    </a>
                );
            }
            
            const linkText = part.url.split('/').pop()?.split('-').slice(1).join('-') || 'Attached Document';
            return (
                <a
                    key={index}
                    href={part.url} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-2 bg-gray-600 p-3 rounded-lg hover:bg-gray-500 transition-colors"
                >
                    <div className="flex items-center space-x-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>
                        <span className="text-blue-300 hover:underline truncate" title={linkText}>{linkText}</span>
                    </div>
                </a>
            );
        }
        return null;
    });
};

const JobPostingMessage: React.FC<{ job: JobPosting }> = ({ job }) => (
    <div className="w-full">
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-500/50">
            <IconBriefcase />
            <span className="font-bold text-sm uppercase tracking-wider text-gray-200">Job Opportunity</span>
        </div>
        <h4 className="font-bold text-lg text-white mb-1">{job.title}</h4>
        <p className="text-sm text-gray-300 font-medium">{job.company} &middot; {job.location}</p>
        <p className="mt-3 text-sm text-gray-300 whitespace-pre-wrap">{job.description}</p>
    </div>
);

const JobPostingModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (job: JobPosting) => void;
}> = ({ isOpen, onClose, onSubmit }) => {
    const [jobData, setJobData] = React.useState<JobPosting>({ title: '', company: 'EriPro Inc.', location: '', description: '' });
    
    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(jobData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-6 text-white">Create Job Posting</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Job Title</label>
                        <input type="text" value={jobData.title} onChange={e => setJobData({...jobData, title: e.target.value})} className="mt-1 w-full rounded-md border-gray-600 bg-gray-700 text-white p-2" required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Company</label>
                            <input type="text" value={jobData.company} onChange={e => setJobData({...jobData, company: e.target.value})} className="mt-1 w-full rounded-md border-gray-600 bg-gray-700 text-white p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Location</label>
                            <input type="text" value={jobData.location} onChange={e => setJobData({...jobData, location: e.target.value})} className="mt-1 w-full rounded-md border-gray-600 bg-gray-700 text-white p-2" required />
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-300">Description</label>
                        <textarea value={jobData.description} onChange={e => setJobData({...jobData, description: e.target.value})} className="mt-1 w-full rounded-md border-gray-600 bg-gray-700 text-white p-2" rows={4} required></textarea>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-600 text-gray-200 hover:bg-gray-500">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Post Job</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

interface MessageAreaProps {
    activeChannel: Channel | undefined;
    channelMessages: Message[];
    currentUser: User;
    usersMap: Map<number, User>;
    users: User[];
    typingStatus: Record<string, string | null>;
    newMessage: string;
    attachment: File | null;
    setAttachment: (file: File | null) => void;
    fileInputRef: React.RefObject<HTMLInputElement>;
    handleTyping: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    handleFormSubmit: (e: React.FormEvent) => void;
    isInputDisabled: boolean;
    placeholderText: string;
    canPostSpecial: boolean;
    isSpecialMessagePopupOpen: boolean;
    setSpecialMessagePopupOpen: (open: boolean) => void;
    popupRef: React.RefObject<HTMLDivElement>;
    isJobModalOpen: boolean;
    setJobModalOpen: (open: boolean) => void;
    handleSendJobPosting: (jobData: JobPosting) => void;
}

const MessageArea: React.FC<MessageAreaProps> = ({
    activeChannel, channelMessages, currentUser, usersMap, users, typingStatus,
    newMessage, attachment, setAttachment, fileInputRef, handleTyping, handleFormSubmit, 
    isInputDisabled, placeholderText, canPostSpecial, isSpecialMessagePopupOpen, 
    setSpecialMessagePopupOpen, popupRef, isJobModalOpen, setJobModalOpen, handleSendJobPosting
}) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [channelMessages]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [newMessage]);


    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleFormSubmit(e);
        }
    };
    
    const handleRemoveAttachment = () => {
        setAttachment(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const typingUserName = activeChannel ? typingStatus[activeChannel.id] : null;

    return (
        <div className="flex-1 flex flex-col">
            <JobPostingModal isOpen={isJobModalOpen} onClose={() => setJobModalOpen(false)} onSubmit={handleSendJobPosting} />
            <div className="border-b border-gray-700 p-4">
                <h2 className="text-xl font-bold text-white">{activeChannel?.name || 'Select a conversation'}</h2>
            </div>
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {channelMessages.map(msg => {
                    const sender = usersMap.get(msg.userId);
                    const isCurrentUser = msg.userId === currentUser.id;
                    const isAnnouncement = msg.type === MessageType.ANNOUNCEMENT;
                    const isJobPosting = msg.type === MessageType.JOB_POSTING;
                    
                    const baseStyles = 'px-4 py-2 rounded-2xl max-w-lg';
                    let typeStyles = '';

                    if (isAnnouncement) {
                        typeStyles = 'bg-amber-100 dark:bg-amber-800/50 border border-amber-300 dark:border-amber-600/50';
                    } else if (isJobPosting) {
                        typeStyles = 'bg-gray-700 border border-gray-600';
                    } else if (isCurrentUser) {
                        typeStyles = 'bg-blue-600 text-white rounded-br-none';
                    } else {
                        typeStyles = 'bg-gray-700 text-gray-200 rounded-bl-none';
                    }

                    return (
                        <div key={msg.id} className={`flex items-start gap-3 ${isCurrentUser ? 'justify-end' : ''} new-message-animation`}>
                            {!isCurrentUser && sender && <img src={sender.avatarUrl} className="w-10 h-10 rounded-full object-cover" alt={`${sender.firstName} ${sender.fatherName}`}/>}
                            <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                                <div className={`${baseStyles} ${typeStyles}`}>
                                    {isAnnouncement && (
                                        <div className="flex items-center gap-2 mb-2 pb-1 border-b border-amber-400/50 dark:border-amber-500/50">
                                            <IconAnnouncement />
                                            <span className="font-bold text-sm uppercase tracking-wider text-amber-800 dark:text-amber-200">
                                                {activeChannel?.id === 'broadcast' ? 'Broadcast' : 'Announcement'}
                                            </span>
                                        </div>
                                    )}
                                    {!isCurrentUser && !isAnnouncement && !isJobPosting && <p className="font-bold text-sm mb-1 text-blue-400">{sender?.firstName} {sender?.fatherName}</p>}
                                    
                                    <div className={`${isAnnouncement ? 'text-gray-800 dark:text-gray-200' : ''}`}>
                                        {isJobPosting && typeof msg.content === 'object' 
                                            ? <JobPostingMessage job={msg.content} />
                                            : renderMessageContent(msg.content as string)
                                        }
                                    </div>
                                </div>
                                <span className="text-xs text-gray-500 mt-1">{msg.timestamp}</span>
                            </div>
                            {isCurrentUser && sender && <img src={sender.avatarUrl} className="w-10 h-10 rounded-full object-cover" alt={`${sender.firstName} ${sender.fatherName}`}/>}
                        </div>
                    );
                })}
                {typingUserName && (
                    <div className="flex items-start gap-3 new-message-animation">
                        {(() => {
                            const typingUser = users.find(u => `${u.firstName} ${u.fatherName}` === typingUserName);
                            return typingUser ? <img src={typingUser.avatarUrl} className="w-10 h-10 rounded-full" alt={typingUser.firstName} /> : <div className="w-10 h-10"></div>;
                        })()}
                        <div className="px-4 py-3 rounded-2xl bg-gray-700 text-gray-200 rounded-bl-none">
                            <div className="flex items-center space-x-1 animate-pulse">
                                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animation-delay-200"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animation-delay-400"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 bg-gray-800 border-t border-gray-700">
                {attachment && (
                    <div className="mb-2 flex items-center justify-between bg-gray-700 p-2 rounded-md">
                        <div className="flex items-center space-x-2 overflow-hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a3 3 0 006 0V7a1 1 0 112 0v4a5 5 0 01-10 0V7a5 5 0 0110 0v4a1 1 0 11-2 0V7a3 3 0 00-3-3z" clipRule="evenodd" /></svg>
                            <span className="text-sm text-gray-300 truncate" title={attachment.name}>{attachment.name}</span>
                        </div>
                        <button type="button" onClick={handleRemoveAttachment} className="p-1 rounded-full text-gray-400 hover:bg-gray-600 hover:text-white" aria-label="Remove attachment">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                )}
                <form onSubmit={handleFormSubmit} className="flex items-start space-x-3">
                     <div className="flex items-center pt-1">
                        {canPostSpecial && (
                            <div className="relative">
                                <button type="button" onClick={() => setSpecialMessagePopupOpen(!isSpecialMessagePopupOpen)} className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white" aria-label="More options">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                </button>
                                {isSpecialMessagePopupOpen && (
                                    <div ref={popupRef} className="absolute bottom-12 left-0 w-48 bg-gray-900 rounded-md shadow-lg z-10 border border-gray-700">
                                        <button onClick={() => { setJobModalOpen(true); setSpecialMessagePopupOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Post Job Opportunity</button>
                                    </div>
                                )}
                            </div>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={(e) => setAttachment(e.target.files ? e.target.files[0] : null)}
                            className="hidden"
                            accept="image/*,.pdf,.doc,.docx,.txt"
                            id="chat-file-input"
                        />
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white" aria-label="Attach file">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a3 3 0 006 0V7a1 1 0 112 0v4a5 5 0 01-10 0V7a5 5 0 0110 0v4a1 1 0 11-2 0V7a3 3 0 00-3-3z" clipRule="evenodd" /></svg>
                        </button>
                     </div>
                    <textarea
                        ref={textareaRef}
                        value={newMessage}
                        onChange={handleTyping}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholderText}
                        className="flex-1 bg-gray-600 rounded-lg px-4 py-2 text-white border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed resize-none max-h-40"
                        rows={1}
                        disabled={isInputDisabled}
                        required={!attachment}
                    />
                    <button type="submit" className="bg-blue-600 text-white rounded-lg p-2 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed self-end" disabled={isInputDisabled || (!newMessage.trim() && !attachment)} aria-label="Send message">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MessageArea;