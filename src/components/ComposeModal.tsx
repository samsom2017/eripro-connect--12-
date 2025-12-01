
import React, { useState, useRef } from 'react';
import { User } from '../types';

interface ComposeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (details: { email: string, subject: string, message: string }) => void;
    users: User[];
    currentUser: User;
}

const ComposeModal: React.FC<ComposeModalProps> = ({ isOpen, onClose, onSubmit, users, currentUser }) => {
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleRemoveAttachment = () => {
        setAttachmentFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // A message must have either text content or an attachment.
        if (!email.trim() || (!message.trim() && !attachmentFile)) return;
        
        let finalMessage = message;
        if (attachmentFile) {
            const isImage = attachmentFile.type.startsWith('image/');
            // Use a unique name for the simulated file path to avoid image caching issues
            const uniqueFileName = `${Date.now()}-${attachmentFile.name}`;
            const urlPath = isImage ? '/img/simulated/' : '/docs/simulated/';
            const attachmentUrl = `${urlPath}${uniqueFileName}`;
            // Add a clear separator for parsing
            finalMessage += `${finalMessage ? '\n\n' : ''}[attachment]${attachmentUrl}[/attachment]`;
        }
        
        onSubmit({ email, subject, message: finalMessage });
        
        setEmail('');
        setSubject('');
        setMessage('');
        handleRemoveAttachment();
    };

    const otherUsers = users.filter(u => u.id !== currentUser.id);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-6 text-white">New Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="recipient-email" className="block text-sm font-medium text-gray-300">To:</label>
                        <input
                            type="email"
                            id="recipient-email"
                            list="user-emails"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="recipient@eripro.com"
                            className="mt-1 w-full rounded-md border-gray-600 bg-gray-700 text-white p-2"
                            required
                        />
                        <datalist id="user-emails">
                            {otherUsers.map(user => <option key={user.id} value={user.email}>{`${user.firstName} ${user.fatherName}`}</option>)}
                        </datalist>
                    </div>
                     <div>
                        <label htmlFor="message-subject" className="block text-sm font-medium text-gray-300">Subject</label>
                        <input
                            type="text"
                            id="message-subject"
                            value={subject}
                            onChange={e => setSubject(e.target.value)}
                            placeholder="Message subject (optional)"
                            className="mt-1 w-full rounded-md border-gray-600 bg-gray-700 text-white p-2"
                        />
                    </div>
                     <div>
                        <label htmlFor="message-body" className="block text-sm font-medium text-gray-300">Message</label>
                        <textarea
                            id="message-body"
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            className="mt-1 w-full rounded-md border-gray-600 bg-gray-700 text-white p-2"
                            rows={6}
                            required={!attachmentFile}
                        ></textarea>
                    </div>
                    <div>
                        <label htmlFor="message-attachment" className="block text-sm font-medium text-gray-300">Attach Document (Optional)</label>
                        <input
                            type="file"
                            id="message-attachment"
                            ref={fileInputRef}
                            onChange={e => setAttachmentFile(e.target.files ? e.target.files[0] : null)}
                            className="mt-1 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            accept="image/*,.pdf,.doc,.docx,.txt"
                        />
                    </div>
                    {attachmentFile && (
                        <div className="mt-2 flex items-center justify-between bg-gray-700 p-2 rounded-md">
                            <div className="flex items-center space-x-2 overflow-hidden">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a3 3 0 006 0V7a1 1 0 112 0v4a5 5 0 01-10 0V7a5 5 0 0110 0v4a1 1 0 11-2 0V7a3 3 0 00-3-3z" clipRule="evenodd" /></svg>
                                <span className="text-sm text-gray-300 truncate" title={attachmentFile.name}>{attachmentFile.name}</span>
                            </div>
                            <button type="button" onClick={handleRemoveAttachment} className="p-1 rounded-full text-gray-400 hover:bg-gray-600 hover:text-white" aria-label="Remove attachment">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                    )}
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-600 text-gray-200 hover:bg-gray-500">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed" disabled={!email.trim() || (!message.trim() && !attachmentFile)}>Send Message</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ComposeModal;