
import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';
import { DEPARTMENT_HIERARCHY, COUNTRY_DATA, AGE_GROUPS } from '../constants';

const IconLinkedin = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>;
const IconTwitter = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>;
const IconGithub = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>;


interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentUser: User;
    onUpdateUser: (user: User) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, currentUser, onUpdateUser }) => {
    const [formData, setFormData] = useState<User>(currentUser);
    const [skills, setSkills] = useState(currentUser.skills?.join(', ') || '');
    const avatarInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setFormData(currentUser);
        setSkills(currentUser.skills?.join(', ') || '');
    }, [currentUser, isOpen]);
    
    useEffect(() => {
        // When department is loaded, check if specialization is valid, if not, reset it.
        const availableSpecializations = DEPARTMENT_HIERARCHY[formData.department]?.specializations || [];
        if (!availableSpecializations.includes(formData.specialization)) {
             setFormData(prev => ({
                ...prev,
                specialization: availableSpecializations[0] || ''
            }));
        }
    }, [formData.department, formData.specialization]);

    if (!isOpen) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            socialMediaLinks: {
                ...(prev.socialMediaLinks || {}),
                [name]: value,
            },
        }));
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const newAvatarUrl = `https://picsum.photos/seed/${Date.now()}/100/100`;
            setFormData(prev => ({ ...prev, avatarUrl: newAvatarUrl }));
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdateUser({
            ...formData,
            yearsOfExperience: Number(formData.yearsOfExperience),
            skills: skills.split(',').map(s => s.trim()).filter(Boolean),
            eritreanIdNumber: formData.hasEritreanId ? formData.eritreanIdNumber : undefined,
            workDurationInEritrea: formData.wantsToWorkInEritrea === 'Yes' ? formData.workDurationInEritrea : undefined,
        });
        onClose();
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Edit Your Profile</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative group">
                            <img src={formData.avatarUrl} alt="Profile" className="w-24 h-24 rounded-full border-4 border-blue-500 object-cover" />
                            <button type="button" onClick={() => avatarInputRef.current?.click()} className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center rounded-full transition-opacity cursor-pointer">
                                <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-semibold">Change</span>
                            </button>
                            <input type="file" ref={avatarInputRef} onChange={handleAvatarChange} className="hidden" accept="image/*" />
                        </div>
                        <p className="text-lg font-semibold">{formData.firstName} {formData.fatherName}</p>
                    </div>

                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                         <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
                                <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Father's Name</label>
                                <input type="text" name="fatherName" value={formData.fatherName} onChange={handleInputChange} className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Gender</label>
                                <select name="gender" value={formData.gender} onChange={handleInputChange} className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2">
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Other</option>
                                    <option>Prefer not to say</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Age Group</label>
                                <select name="ageGroup" value={formData.ageGroup} onChange={handleInputChange} className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2">
                                    {AGE_GROUPS.map(group => <option key={group} value={group}>{group}</option>)}
                                </select>
                            </div>
                        </div>
                         <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                            <input type="email" value={formData.email} className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-900 text-gray-900 dark:text-white p-2" disabled readOnly />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                         <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Professional Information</h3>
                        <div>
                            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
                            <textarea id="bio" name="bio" value={formData.bio || ''} onChange={handleInputChange} rows={3} className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2" placeholder="Tell us a bit about yourself..."></textarea>
                        </div>
                        <div className="mt-4">
                            <label htmlFor="skills" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Skills</label>
                            <input type="text" id="skills" value={skills} onChange={e => setSkills(e.target.value)} className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2" placeholder="React, TypeScript, Project Management" />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Enter skills separated by commas.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Department</label>
                                <input type="text" value={formData.department} className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-900 text-gray-900 dark:text-white p-2" disabled readOnly />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Specialization</label>
                                <select name="specialization" value={formData.specialization} onChange={handleInputChange} className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2">
                                    {(DEPARTMENT_HIERARCHY[formData.department]?.specializations || []).map(spec => <option key={spec} value={spec}>{spec}</option>)}
                                </select>
                            </div>
                        </div>
                         <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Years of Experience</label>
                            <input type="number" name="yearsOfExperience" value={formData.yearsOfExperience} onChange={handleInputChange} className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2" min="0" />
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Primary Goal on EriPro Connect</label>
                            <select name="primaryGoal" value={formData.primaryGoal} onChange={handleInputChange} className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2">
                                <option>Job Seeking</option>
                                <option>Networking</option>
                                <option>Collaboration</option>
                                <option>Platform Management</option>
                                <option>General Interest</option>
                            </select>
                        </div>
                    </div>

                     <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                         <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Eritrea-Specific Information</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Birth Place</label>
                                <div className="flex items-center space-x-4 mt-2">
                                    <label className="flex items-center"><input type="radio" name="birthPlace" value="Inside Eritrea" checked={formData.birthPlace === 'Inside Eritrea'} onChange={handleInputChange} className="h-4 w-4 text-blue-500 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500" /> <span className="ml-2 text-sm">Inside</span></label>
                                    <label className="flex items-center"><input type="radio" name="birthPlace" value="Outside Eritrea" checked={formData.birthPlace === 'Outside Eritrea'} onChange={handleInputChange} className="h-4 w-4 text-blue-500 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500" /> <span className="ml-2 text-sm">Outside</span></label>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Eritrean ID</label>
                                <div className="flex items-center space-x-4 mt-2">
                                    <label className="flex items-center"><input type="radio" checked={formData.hasEritreanId} onChange={() => setFormData(p => ({...p, hasEritreanId: true}))} className="h-4 w-4 text-blue-500 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500" /> <span className="ml-2 text-sm">Yes</span></label>
                                    <label className="flex items-center"><input type="radio" checked={!formData.hasEritreanId} onChange={() => setFormData(p => ({...p, hasEritreanId: false}))} className="h-4 w-4 text-blue-500 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500" /> <span className="ml-2 text-sm">No</span></label>
                                </div>
                            </div>
                         </div>
                         {formData.hasEritreanId && (
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Eritrean ID Number</label>
                                <input type="text" name="eritreanIdNumber" value={formData.eritreanIdNumber || ''} onChange={handleInputChange} className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2" placeholder="e.g. 12345/01" required />
                            </div>
                         )}
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Interest in Working in Eritrea?</label>
                                <select name="wantsToWorkInEritrea" value={formData.wantsToWorkInEritrea} onChange={handleInputChange} className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2">
                                    <option>Yes</option>
                                    <option>No</option>
                                    <option>I don't know</option>
                                </select>
                            </div>
                            {formData.wantsToWorkInEritrea === 'Yes' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Desired Duration</label>
                                    <select name="workDurationInEritrea" value={formData.workDurationInEritrea || ''} onChange={handleInputChange} className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2">
                                        <option>1-6 months</option>
                                        <option>6-12 months</option>
                                        <option>1-2 years</option>
                                        <option>Permanently</option>
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                         <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Contact & Social Links</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Country</label>
                                <select name="country" value={formData.country} onChange={handleInputChange} className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2">
                                <option value="">Select a country</option>
                                {COUNTRY_DATA.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Telephone</label>
                                <input type="tel" name="telephone" value={formData.telephone || ''} onChange={handleInputChange} className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2" />
                            </div>
                        </div>
                        <div className="space-y-3 mt-4">
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3"><IconLinkedin className="w-5 h-5 text-gray-400" /></span>
                                <input type="url" name="linkedin" placeholder="https://linkedin.com/in/..." value={formData.socialMediaLinks?.linkedin || ''} onChange={handleSocialChange} className="w-full pl-10 p-2 rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                            </div>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3"><IconTwitter className="w-5 h-5 text-gray-400" /></span>
                                <input type="url" name="twitter" placeholder="https://x.com/..." value={formData.socialMediaLinks?.twitter || ''} onChange={handleSocialChange} className="w-full pl-10 p-2 rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                            </div>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3"><IconGithub className="w-5 h-5 text-gray-400" /></span>
                                <input type="url" name="github" placeholder="https://github.com/..." value={formData.socialMediaLinks?.github || ''} onChange={handleSocialChange} className="w-full pl-10 p-2 rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileModal;
