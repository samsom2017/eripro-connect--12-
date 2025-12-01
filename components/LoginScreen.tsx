
import React, { useState, useEffect } from 'react';
import { User, Department, Role } from '../types';
import { DEPARTMENT_HIERARCHY, COUNTRY_DATA, ERITREAN_CITIES, WELCOME_GREETINGS, AGE_GROUPS } from '../constants';

type View = 'home' | 'about' | 'contact' | 'login' | 'register';

type RegisterUser = Omit<User, 'id' | 'role' | 'avatarUrl'>;

interface LandingPageProps {
  onLogin: (credentials: { email: string; password: string }) => void;
  onRegister: (newUser: RegisterUser) => void;
}

const IconLinkedin = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>;
const IconTwitter = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>;
const IconGithub = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>;


const LoginForm: React.FC<{ 
    onLogin: (credentials: { email: string; password: string }) => void; 
    title: string; 
    isAdmin?: boolean;
    onForgotPassword: () => void; 
}> = ({ onLogin, title, isAdmin = false, onForgotPassword }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin({ email, password });
    };

    return (
        <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">{title}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor={`${isAdmin ? 'admin-' : ''}email`} className="block text-sm font-medium text-gray-400">Email</label>
                    <input type="email" id={`${isAdmin ? 'admin-' : ''}email`} value={email} onChange={(e) => setEmail(e.target.value)} placeholder={isAdmin ? "e.vance@eripro.com" : "your.email@eripro.com"} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                </div>
                <div>
                    <label htmlFor={`${isAdmin ? 'admin-' : ''}password`} className="block text-sm font-medium text-gray-400">Password</label>
                    <input type="password" id={`${isAdmin ? 'admin-' : ''}password`} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300">Login</button>
            </form>
             <div className="text-center mt-4">
                <button type="button" onClick={onForgotPassword} className="text-sm font-medium text-blue-500 hover:text-blue-400">
                    Forgot password?
                </button>
            </div>
        </div>
    );
};

const Register: React.FC<{ onRegister: (newUser: RegisterUser) => void }> = ({ onRegister }) => {
    const [firstName, setFirstName] = useState('');
    const [fatherName, setFatherName] = useState('');
    const [email, setEmail] = useState('');
    const [department, setDepartment] = useState<Department>(Department.ENGINEERING);
    const [specialization, setSpecialization] = useState('');
    const [yearsOfExperience, setYearsOfExperience] = useState<number | ''>('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [country, setCountry] = useState('Eritrea');
    const [phoneCode, setPhoneCode] = useState('+291');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [gender, setGender] = useState<'Male' | 'Female' | 'Other' | 'Prefer not to say'>('Male');
    const [birthPlace, setBirthPlace] = useState<'Inside Eritrea' | 'Outside Eritrea'>('Inside Eritrea');
    const [hasEritreanId, setHasEritreanId] = useState<boolean>(true);
    const [eritreanIdNumber, setEritreanIdNumber] = useState('');
    const [wantsToWorkInEritrea, setWantsToWorkInEritrea] = useState<'Yes' | 'No' | "I don't know">('Yes');
    const [workDurationInEritrea, setWorkDurationInEritrea] = useState('Permanently');
    const [primaryGoal, setPrimaryGoal] = useState('Job Seeking');
    const [ageGroup, setAgeGroup] = useState(AGE_GROUPS[0]);
    const [documentFile, setDocumentFile] = useState<File | null>(null);
    const [bio, setBio] = useState('');
    const [socialMediaLinks, setSocialMediaLinks] = useState({ linkedin: '', twitter: '', github: '' });
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const availableSpecializations = DEPARTMENT_HIERARCHY[department]?.specializations || [];
        setSpecialization(availableSpecializations[0] || '');
      }, [department]);

    const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCountry = e.target.value;
        setCountry(newCountry);
        const countryData = COUNTRY_DATA.find(c => c.name === newCountry);
        if (countryData) {
            setPhoneCode(countryData.code);
        }
    };

    const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSocialMediaLinks(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (yearsOfExperience === '' || yearsOfExperience < 0) {
            setError("Please enter a valid number for years of experience.");
            return;
        };
        
        const telephone = `${phoneCode} ${phoneNumber}`.trim();
        const documentUrl = documentFile ? `/docs/simulated/${documentFile.name}` : undefined;

        onRegister({ 
            firstName, 
            fatherName, 
            email, 
            department, 
            specialization, 
            yearsOfExperience: Number(yearsOfExperience), 
            password, 
            country, 
            telephone,
            gender,
            birthPlace,
            hasEritreanId,
            eritreanIdNumber: hasEritreanId ? eritreanIdNumber : undefined,
            wantsToWorkInEritrea,
            workDurationInEritrea: wantsToWorkInEritrea === 'Yes' ? workDurationInEritrea : undefined,
            primaryGoal,
            ageGroup,
            documentUrl,
            bio: bio.trim() ? bio : undefined,
            socialMediaLinks: {
                linkedin: socialMediaLinks.linkedin || undefined,
                twitter: socialMediaLinks.twitter || undefined,
                github: socialMediaLinks.github || undefined,
            }
        });
        
        // Reset form
        setFirstName('');
        setFatherName('');
        setEmail('');
        setDepartment(Department.ENGINEERING);
        setYearsOfExperience('');
        setPassword('');
        setConfirmPassword('');
        setCountry('Eritrea');
        setPhoneCode('+291');
        setPhoneNumber('');
        setEritreanIdNumber('');
        setAgeGroup(AGE_GROUPS[0]);
        setDocumentFile(null);
        setBio('');
        setSocialMediaLinks({ linkedin: '', twitter: '', github: '' });
        const docInput = document.getElementById('document') as HTMLInputElement;
        if(docInput) docInput.value = '';

        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
    };
    return (
        <div className="w-full max-w-3xl mx-auto bg-gray-800 p-8 rounded-lg shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Create Your Account</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-400">First Name</label>
                        <input type="text" id="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                    </div>
                    <div>
                        <label htmlFor="fatherName" className="block text-sm font-medium text-gray-400">Father's Name</label>
                        <input type="text" id="fatherName" value={fatherName} onChange={e => setFatherName(e.target.value)} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-400">Email Address</label>
                        <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                    </div>
                    <div>
                        <label htmlFor="gender" className="block text-sm font-medium text-gray-400">Gender</label>
                         <select id="gender" value={gender} onChange={e => setGender(e.target.value as any)} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                            <option>Prefer not to say</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="ageGroup" className="block text-sm font-medium text-gray-400">Age Group</label>
                        <select id="ageGroup" value={ageGroup} onChange={e => setAgeGroup(e.target.value)} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                            {AGE_GROUPS.map(group => <option key={group} value={group}>{group}</option>)}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Born inside or outside Eritrea?</label>
                        <div className="flex items-center space-x-4 mt-2">
                            <label className="flex items-center"><input type="radio" value="Inside Eritrea" checked={birthPlace === 'Inside Eritrea'} onChange={e => setBirthPlace(e.target.value as any)} className="h-4 w-4 text-blue-500 bg-gray-700 border-gray-600 focus:ring-blue-600" /> <span className="ml-2 text-sm">Inside</span></label>
                            <label className="flex items-center"><input type="radio" value="Outside Eritrea" checked={birthPlace === 'Outside Eritrea'} onChange={e => setBirthPlace(e.target.value as any)} className="h-4 w-4 text-blue-500 bg-gray-700 border-gray-600 focus:ring-blue-600" /> <span className="ml-2 text-sm">Outside</span></label>
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-400">Do you have an Eritrean ID?</label>
                        <div className="flex items-center space-x-4 mt-2">
                            <label className="flex items-center"><input type="radio" value="yes" checked={hasEritreanId} onChange={() => setHasEritreanId(true)} className="h-4 w-4 text-blue-500 bg-gray-700 border-gray-600 focus:ring-blue-600" /> <span className="ml-2 text-sm">Yes</span></label>
                            <label className="flex items-center"><input type="radio" value="no" checked={!hasEritreanId} onChange={() => setHasEritreanId(false)} className="h-4 w-4 text-blue-500 bg-gray-700 border-gray-600 focus:ring-blue-600" /> <span className="ml-2 text-sm">No</span></label>
                        </div>
                    </div>
                    {hasEritreanId && (
                        <div className="md:col-span-2">
                             <label htmlFor="eritreanId" className="block text-sm font-medium text-gray-400">Eritrean ID Number</label>
                            <input type="text" id="eritreanId" value={eritreanIdNumber} onChange={e => setEritreanIdNumber(e.target.value)} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. 12345/01" required />
                        </div>
                    )}
                </div>
                
                <div className="pt-2">
                    <label htmlFor="document" className="block text-sm font-medium text-gray-400">Attach Document (CV, Portfolio, etc. - Optional)</label>
                    <input type="file" id="document" onChange={e => setDocumentFile(e.target.files ? e.target.files[0] : null)} className="mt-1 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="department" className="block text-sm font-medium text-gray-400">Department</label>
                        <select id="department" value={department} onChange={e => setDepartment(e.target.value as Department)} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                            {Object.values(Department).map(dep => <option key={dep} value={dep}>{dep}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="specialization" className="block text-sm font-medium text-gray-400">Specialization / Role</label>
                        <select id="specialization" value={specialization} onChange={e => setSpecialization(e.target.value)} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" required>
                             {(DEPARTMENT_HIERARCHY[department]?.specializations || []).map(spec => <option key={spec} value={spec}>{spec}</option>)}
                        </select>
                    </div>
                </div>
                 <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-400">Years of Experience</label>
                    <input type="number" id="experience" value={yearsOfExperience} onChange={e => setYearsOfExperience(e.target.value === '' ? '' : parseInt(e.target.value, 10))} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" min="0" required/>
                </div>
                 <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-400">Bio (Optional)</label>
                    <textarea id="bio" value={bio} onChange={e => setBio(e.target.value)} rows={3} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="A brief professional summary..."></textarea>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Do you want to work in Eritrea?</label>
                         <select value={wantsToWorkInEritrea} onChange={e => setWantsToWorkInEritrea(e.target.value as any)} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                            <option>Yes</option>
                            <option>No</option>
                            <option>I don't know</option>
                        </select>
                    </div>
                    {wantsToWorkInEritrea === 'Yes' && (
                        <div>
                             <label className="block text-sm font-medium text-gray-400">For how long?</label>
                             <select value={workDurationInEritrea} onChange={e => setWorkDurationInEritrea(e.target.value)} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                <option>1-6 months</option>
                                <option>6-12 months</option>
                                <option>1-2 years</option>
                                <option>Permanently</option>
                            </select>
                        </div>
                    )}
                </div>
                 <div>
                    <label htmlFor="primaryGoal" className="block text-sm font-medium text-gray-400">Primary Goal on EriPro Connect</label>
                    <select id="primaryGoal" value={primaryGoal} onChange={e => setPrimaryGoal(e.target.value)} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                        <option>Job Seeking</option>
                        <option>Networking</option>
                        <option>Collaboration</option>
                        <option>Platform Management</option>
                        <option>General Interest</option>
                    </select>
                </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-400">Country of Residence</label>
                        <select id="country" value={country} onChange={handleCountryChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                            <option value="">Select a country</option>
                            {COUNTRY_DATA.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="telephone" className="block text-sm font-medium text-gray-400">Telephone (Optional)</label>
                        <div className="flex mt-1">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-600 bg-gray-800 text-gray-400 text-sm">
                               {phoneCode}
                            </span>
                            <input type="tel" id="telephone" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} className="flex-1 block w-full bg-gray-700 border border-gray-600 rounded-none rounded-r-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                    </div>
                </div>
                 <div className="pt-2">
                    <h3 className="text-md font-medium text-gray-400 mb-2">Social Links (Optional)</h3>
                    <div className="space-y-3">
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <IconLinkedin className="w-5 h-5 text-gray-400" />
                            </span>
                            <input type="url" name="linkedin" placeholder="https://linkedin.com/in/..." value={socialMediaLinks.linkedin} onChange={handleSocialChange} className="w-full pl-10 p-2 rounded-md bg-gray-700 border border-gray-600 text-white" />
                        </div>
                        <div className="relative">
                             <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <IconTwitter className="w-5 h-5 text-gray-400" />
                            </span>
                            <input type="url" name="twitter" placeholder="https://x.com/..." value={socialMediaLinks.twitter} onChange={handleSocialChange} className="w-full pl-10 p-2 rounded-md bg-gray-700 border border-gray-600 text-white" />
                        </div>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <IconGithub className="w-5 h-5 text-gray-400" />
                            </span>
                            <input type="url" name="github" placeholder="https://github.com/..." value={socialMediaLinks.github} onChange={handleSocialChange} className="w-full pl-10 p-2 rounded-md bg-gray-700 border border-gray-600 text-white" />
                        </div>
                    </div>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-400">Password</label>
                        <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-400">Confirm Password</label>
                        <input type="password" id="confirmPassword" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                    </div>
                </div>
                {error && <p className="text-red-400 text-center text-sm">{error}</p>}
                <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 text-lg">Register</button>
                {submitted && <p className="text-green-400 text-center text-sm mt-2">Registration successful! A super admin will grant you access.</p>}
            </form>
        </div>
    );
};

const ForgotPasswordForm: React.FC<{ 
    onSubmit: (email: string) => void; 
    onBackToLogin: () => void; 
}> = ({ onSubmit, onBackToLogin }) => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(email);
    };

    return (
        <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">Reset Password</h2>
            <p className="text-center text-gray-400 mb-6 text-sm">Enter your email address and we will simulate sending you a link to reset your password.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="reset-email" className="block text-sm font-medium text-gray-400">Email</label>
                    <input type="email" id="reset-email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your.email@eripro.com" className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300">Send Reset Link</button>
            </form>
            <div className="text-center mt-4">
                <button onClick={onBackToLogin} className="text-sm text-gray-400 hover:underline">
                    &larr; Back to Login
                </button>
            </div>
        </div>
    );
};

const PasswordResetConfirmation: React.FC<{ 
    onBackToLogin: () => void; 
}> = ({ onBackToLogin }) => {
    return (
        <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md mx-auto text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Check Your Inbox</h2>
            <p className="text-gray-300 mb-6">If an account with the provided email exists, a password reset link has been sent. (This is a simulation).</p>
            <button onClick={onBackToLogin} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300">
                Return to Login
            </button>
        </div>
    );
};

const ContactForm: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Simulating contact form submission:", { name, email, subject, message });
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
    };

    return (
        <div className="mt-16 w-full">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold mb-6 text-center">Send Us a Message</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="contact-name" className="block text-sm font-medium text-gray-400">Full Name</label>
                            <input type="text" id="contact-name" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                        </div>
                        <div>
                            <label htmlFor="contact-email" className="block text-sm font-medium text-gray-400">Email Address</label>
                            <input type="email" id="contact-email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="contact-subject" className="block text-sm font-medium text-gray-400">Subject</label>
                        <input type="text" id="contact-subject" value={subject} onChange={e => setSubject(e.target.value)} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                    </div>
                    <div>
                        <label htmlFor="contact-message" className="block text-sm font-medium text-gray-400">Message</label>
                        <textarea id="contact-message" value={message} onChange={e => setMessage(e.target.value)} rows={4} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" required></textarea>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300">Submit Message</button>
                    {submitted && <p className="text-green-400 text-center text-sm mt-2">Thank you for your message! We will get back to you shortly.</p>}
                </form>
            </div>
        </div>
    );
};

const IconUsersGroup: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
    </svg>
);

const IconBuildingOffice: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 11H8V9h4v2zm4-2h-4V7h4v2zm-4 6H8v-2h4v2zm4 0h-4v-2h4v2zm4-10v12h-2V7h-2V5h4zM10 5H6v14h12V5h-8zM4 19h2V5H4v14z"/>
    </svg>
);

const IconBriefcaseLanding: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM10 4h4v2h-4V4z"/>
    </svg>
);

const IconSupport = ({ className }: { className?: string }) => (
    <div className="flex-shrink-0 bg-blue-500/10 text-blue-400 rounded-lg p-3">
        <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    </div>
);

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onRegister }) => {
    const [activeView, setActiveView] = useState<View>('home');
    const [loginTab, setLoginTab] = useState<'user' | 'admin'>('user');
    const [loginView, setLoginView] = useState<'signIn' | 'forgotPassword' | 'confirmation'>('signIn');
    const [greetingIndex, setGreetingIndex] = useState(0);
    
    useEffect(() => {
        if (activeView !== 'login') {
            setLoginView('signIn');
        }
    }, [activeView]);

    useEffect(() => {
        if (activeView === 'home') {
            const timer = setInterval(() => {
                setGreetingIndex(prevIndex => (prevIndex + 1) % WELCOME_GREETINGS.length);
            }, 3000);
            return () => clearInterval(timer);
        }
    }, [activeView]);


    const NavLink: React.FC<{ view: View, children: React.ReactNode }> = ({ view, children }) => (
        <button onClick={() => setActiveView(view)} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeView === view ? 'text-white' : 'text-gray-400 hover:text-white'}`}>
            {children}
        </button>
    );

    const renderContent = () => {
        switch (activeView) {
            case 'about':
                return <div className="text-center max-w-6xl mx-auto w-full">
                    <h2 className="text-4xl font-bold mb-4">About EriPro Connect</h2>
                    <p className="text-gray-300 text-lg mb-12">EriPro Connect is designed to foster collaboration within modern organizations, starting with a focus on Eritrean heritage and professional networking.</p>
                    <h3 className="text-3xl font-bold mb-8">Discover the Cities of Eritrea</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {ERITREAN_CITIES.map(city => (
                            <div key={city.name} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
                                <img src={`https://picsum.photos/seed/${city.imageId}/400/200`} alt={city.name} className="w-full h-40 object-cover" />
                                <div className="p-6">
                                    <h4 className="text-2xl font-bold mb-2">{city.name}</h4>
                                    <p className="text-gray-400">{city.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            case 'contact':
                return <div className="text-center max-w-5xl mx-auto w-full">
                    <h2 className="text-4xl font-bold mb-4">Get in Touch</h2>
                    <p className="text-gray-300 text-lg mb-12 max-w-3xl mx-auto">
                        We're here to help you get the most out of EriPro Connect. Whether you're a prospective client, a current user, or a potential partner, we want to hear from you.
                    </p>
                    <div className="grid grid-cols-1 md:max-w-lg md:mx-auto gap-8 text-left">
                        
                        <div className="bg-gray-800 p-8 rounded-lg shadow-lg flex flex-col transform hover:-translate-y-2 transition-transform duration-300">
                            <div className="flex items-center mb-4">
                                <IconSupport className="w-8 h-8"/>
                                <h3 className="text-xl font-bold ml-4">Technical & User Support</h3>
                            </div>
                            <p className="text-gray-400 mb-4 flex-grow">
                                For help with platform features, troubleshooting, account issues, or any technical questions. Our support team is ready to assist.
                            </p>
                            <a href="mailto:support@eripro.com" className="text-blue-400 hover:text-blue-300 font-semibold mt-auto">
                                support@eripro.com &rarr;
                            </a>
                        </div>
                        
                    </div>
                    <ContactForm />
                     <div className="mt-16 bg-gray-800/50 p-6 rounded-lg text-center">
                        <h4 className="text-xl font-bold mb-2">Corporate Headquarters</h4>
                        <p className="text-gray-400">123 Connect Avenue, Asmara, Eritrea</p>
                        <p className="text-gray-400 text-sm mt-2">(Please note: Office visits are by appointment only)</p>
                    </div>
                </div>
            case 'login':
                switch(loginView) {
                    case 'forgotPassword':
                        return <ForgotPasswordForm
                            onSubmit={(email) => {
                                console.log(`Password reset requested for: ${email}. Simulated token: ${crypto.randomUUID()}`);
                                setLoginView('confirmation');
                            }}
                            onBackToLogin={() => setLoginView('signIn')}
                        />
                    case 'confirmation':
                        return <PasswordResetConfirmation onBackToLogin={() => setLoginView('signIn')} />
                    case 'signIn':
                    default:
                         return <div>
                            <div className="flex justify-center mb-8 border-b-2 border-gray-700">
                                <button onClick={() => setLoginTab('user')} className={`px-6 py-3 text-lg font-semibold ${loginTab === 'user' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}>User Login</button>
                                <button onClick={() => setLoginTab('admin')} className={`px-6 py-3 text-lg font-semibold ${loginTab === 'admin' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}>Super Admin</button>
                            </div>
                            {loginTab === 'user' 
                                ? <LoginForm onLogin={onLogin} title="User Login" onForgotPassword={() => setLoginView('forgotPassword')} /> 
                                : <LoginForm onLogin={onLogin} title="Super Admin Login" isAdmin onForgotPassword={() => setLoginView('forgotPassword')} />}
                        </div>
                }
            case 'register':
                return <Register onRegister={onRegister} />
            case 'home':
            default:
                return <div className="text-center w-full max-w-6xl">
                    <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
                        EriPro Connect
                    </h1>
                     <div className="relative h-12 mb-4 flex items-center justify-center">
                        {WELCOME_GREETINGS.map((g, index) => (
                            <span key={g.lang} className={`absolute transition-opacity duration-1000 text-3xl font-semibold text-gray-300 ${greetingIndex === index ? 'opacity-100' : 'opacity-0'}`}>
                                {g.text}
                            </span>
                        ))}
                    </div>
                     <p className="text-gray-300 text-xl max-w-3xl mx-auto mb-8">A sophisticated multi-tenant social and professional platform for modern organizations.</p>

                    <div className="max-w-5xl mx-auto mt-16 p-8 bg-gray-800/50 rounded-2xl shadow-2xl">
                        <h2 className="text-3xl font-bold text-white mb-8">Platform at a Glance</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                            <div className="flex flex-col items-center">
                                <IconUsersGroup className="w-16 h-16 mb-4 text-blue-400" />
                                <p className="text-4xl font-bold text-white">500+</p>
                                <p className="text-gray-400">Professionals Connected</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <IconBuildingOffice className="w-16 h-16 mb-4 text-blue-400" />
                                <p className="text-4xl font-bold text-white">20+</p>
                                <p className="text-gray-400">Departments Collaborating</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <IconBriefcaseLanding className="w-16 h-16 mb-4 text-blue-400" />
                                <p className="text-4xl font-bold text-white">100+</p>
                                <p className="text-gray-400">Opportunities Shared</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="max-w-5xl mx-auto mt-16 text-left">
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-gray-800 p-6 rounded-lg"><h3 className="text-xl font-bold mb-2">Role-Based Access</h3><p className="text-gray-400">Secure 5-tier role hierarchy ensures data segregation and appropriate access for every user.</p></div>
                            <div className="bg-gray-800 p-6 rounded-lg"><h3 className="text-xl font-bold mb-2">Real-time Communication</h3><p className="text-gray-400">Instant messaging and department-specific channels for seamless collaboration.</p></div>
                            <div className="bg-gray-800 p-6 rounded-lg"><h3 className="text-xl font-bold mb-2">Dynamic Dashboards</h3><p className="text-gray-400">Role-specific views that adapt to user permissions and organizational needs.</p></div>
                        </div>
                    </div>
                </div>
        }
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col">
            <header className="p-4 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
                <nav className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                        EriPro Connect
                    </div>
                    <div className="hidden md:flex items-center space-x-2">
                        <NavLink view="home">Home</NavLink>
                        <NavLink view="about">About Us</NavLink>
                        <NavLink view="contact">Contact Us</NavLink>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button onClick={() => setActiveView('login')} className="px-4 py-2 rounded-md text-sm font-medium text-white bg-gray-700 hover:bg-gray-600 transition-colors">Login</button>
                        <button onClick={() => setActiveView('register')} className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors">Register</button>
                    </div>
                </nav>
            </header>
            <main className="flex-grow flex items-center justify-center p-4 md:p-8">
                {renderContent()}
            </main>
        </div>
    );
};

export default LandingPage;
