
import React, { useState, useEffect, useMemo } from 'react';
import { User, Role, Department } from '../types';
import { ROLE_HIERARCHY, DEPARTMENT_HIERARCHY, COUNTRY_DATA, AGE_GROUPS } from '../constants';

const COUNTRIES = COUNTRY_DATA.map(c => c.name);

const IconLinkedin = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>;
const IconTwitter = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>;
const IconGithub = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>;


interface UserManagementProps {
  currentUser: User;
  users: User[];
  onCreateUser: (user: Omit<User, 'id' | 'avatarUrl' | 'password'>) => void;
  onUpdateUser: (user: User) => void;
  onDeleteUser: (userId: number) => void;
}

const UserFormModal: React.FC<{
    user?: User | null;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (user: any) => void;
    currentUser: User;
}> = ({ user, isOpen, onClose, onSubmit, currentUser }) => {
    const isDepartmentLocked = currentUser.role === Role.ADMIN;

    const getInitialFormData = () => {
        const initialDepartment = isDepartmentLocked 
            ? currentUser.department 
            : (user?.department || Department.ENGINEERING);
        const initialSpecialization = user?.specialization || DEPARTMENT_HIERARCHY[initialDepartment]?.specializations[0] || '';

        return {
            firstName: user?.firstName || '',
            fatherName: user?.fatherName || '',
            email: user?.email || '',
            role: user?.role || Role.USER,
            department: initialDepartment,
            specialization: initialSpecialization,
            yearsOfExperience: user?.yearsOfExperience ?? 0,
            country: user?.country || '',
            telephone: user?.telephone || '',
            gender: user?.gender || 'Male',
            birthPlace: user?.birthPlace || 'Inside Eritrea',
            hasEritreanId: user?.hasEritreanId || false,
            eritreanIdNumber: user?.eritreanIdNumber || '',
            wantsToWorkInEritrea: user?.wantsToWorkInEritrea || "I don't know",
            primaryGoal: user?.primaryGoal || 'Job Seeking',
            ageGroup: user?.ageGroup || AGE_GROUPS[0],
            documentUrl: user?.documentUrl || '',
            bio: user?.bio || '',
            socialMediaLinks: user?.socialMediaLinks || { linkedin: '', twitter: '', github: '' }
        };
    };

    const [formData, setFormData] = useState(getInitialFormData());
    const [skills, setSkills] = useState('');

    useEffect(() => {
        if (isOpen) {
            setFormData(getInitialFormData());
            setSkills(user?.skills?.join(', ') || '');
        }
    }, [user, isOpen, currentUser, isDepartmentLocked]);

    useEffect(() => {
        if (isOpen && !isDepartmentLocked) {
            const availableSpecializations = DEPARTMENT_HIERARCHY[formData.department]?.specializations || [];
            if (!user || !availableSpecializations.includes(formData.specialization)) {
                 setFormData(prev => ({
                    ...prev,
                    specialization: availableSpecializations[0] || ''
                }));
            }
        }
    }, [formData.department, user, isOpen, isDepartmentLocked]);
    
    useEffect(() => {
        if (!formData.hasEritreanId) {
            setFormData(prev => ({ ...prev, eritreanIdNumber: '' }));
        }
    }, [formData.hasEritreanId]);

    if (!isOpen) return null;
    
    const currentUserLevel = ROLE_HIERARCHY[currentUser.role];
    const editableRoles = Object.values(Role).filter(role => ROLE_HIERARCHY[role] < currentUserLevel);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const dataToSubmit = {
            ...formData,
            yearsOfExperience: Number(formData.yearsOfExperience) || 0,
            eritreanIdNumber: formData.hasEritreanId ? formData.eritreanIdNumber : undefined,
            skills: skills.split(',').map(s => s.trim()).filter(Boolean),
        };
        onSubmit({ ...user, ...dataToSubmit });
        onClose();
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

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-lg max-h-screen overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{user ? 'Edit User' : 'Create User'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
                            <input type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Father's Name</label>
                            <input type="text" value={formData.fatherName} onChange={e => setFormData({...formData, fatherName: e.target.value})} className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2" required />
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                        <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2" required />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
                        <textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} rows={3} className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2" placeholder="User's professional summary..."></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Skills</label>
                        <input type="text" value={skills} onChange={e => setSkills(e.target.value)} className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2" placeholder="Comma-separated skills..." />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                            <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as Role})} className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2">
                                {user && !editableRoles.includes(user.role) && <option value={user.role}>{user.role}</option>}
                                {editableRoles.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Department</label>
                            <select value={formData.department} onChange={e => setFormData({...formData, department: e.target.value as Department})} className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 disabled:bg-gray-200 dark:disabled:bg-gray-600" disabled={isDepartmentLocked}>
                                { isDepartmentLocked 
                                    ? <option value={currentUser.department}>{currentUser.department}</option>
                                    : Object.values(Department).map(dep => <option key={dep} value={dep}>{dep}</option>)
                                }
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Specialization</label>
                         <select value={formData.specialization} onChange={e => setFormData({...formData, specialization: e.target.value})} className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2">
                            {(DEPARTMENT_HIERARCHY[formData.department]?.specializations || []).map(spec => <option key={spec} value={spec}>{spec}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Years of Experience</label>
                        <input type="number" value={formData.yearsOfExperience} onChange={e => setFormData({...formData, yearsOfExperience: parseInt(e.target.value, 10) || 0})} className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2" min="0" />
                    </div>
                    
                    <div className="pt-2 space-y-3 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Social Links</h3>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3"><IconLinkedin className="w-5 h-5 text-gray-400" /></span>
                            <input type="url" name="linkedin" placeholder="LinkedIn URL" value={formData.socialMediaLinks?.linkedin || ''} onChange={handleSocialChange} className="w-full pl-10 p-2 rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                        </div>
                         <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3"><IconTwitter className="w-5 h-5 text-gray-400" /></span>
                            <input type="url" name="twitter" placeholder="Twitter/X URL" value={formData.socialMediaLinks?.twitter || ''} onChange={handleSocialChange} className="w-full pl-10 p-2 rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                        </div>
                         <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3"><IconGithub className="w-5 h-5 text-gray-400" /></span>
                            <input type="url" name="github" placeholder="GitHub URL" value={formData.socialMediaLinks?.github || ''} onChange={handleSocialChange} className="w-full pl-10 p-2 rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const UserManagement: React.FC<UserManagementProps> = ({ currentUser, users, onCreateUser, onUpdateUser, onDeleteUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [ageGroupFilter, setAgeGroupFilter] = useState<string>('all');

  const filteredUsers = useMemo(() => {
    let usersToDisplay = users;
    // Admins can only see users in their own department
    if (currentUser.role === Role.ADMIN) {
        usersToDisplay = users.filter(user => user.department === currentUser.department);
    }

    return usersToDisplay.filter(user => {
      const roleMatch = roleFilter === 'all' || user.role === roleFilter;
      const departmentMatch = currentUser.role === Role.SUPER_ADMIN 
        ? (departmentFilter === 'all' || user.department === departmentFilter)
        : true;
      const ageGroupMatch = ageGroupFilter === 'all' || user.ageGroup === ageGroupFilter;
      return roleMatch && departmentMatch && ageGroupMatch;
    });
  }, [users, roleFilter, departmentFilter, ageGroupFilter, currentUser]);

  const canManageUser = (targetUser: User) => {
    const currentUserLevel = ROLE_HIERARCHY[currentUser.role];
    const targetUserLevel = ROLE_HIERARCHY[targetUser.role];
    
    // Rule 0: Cannot manage yourself
    if (currentUser.id === targetUser.id) return false;
    
    // Rule 1: Cannot manage users of same or higher level
    if (currentUserLevel <= targetUserLevel) return false;

    // Rule 2: Admins can only manage users within their department
    if (currentUser.role === Role.ADMIN) {
        return currentUser.department === targetUser.department;
    }

    // Super Admins can manage anyone with a lower role
    return true; 
  };

  const handleCreateClick = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };
  
  const handleDeleteClick = (userId: number) => {
      if(window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
          onDeleteUser(userId);
      }
  };

  const handleFormSubmit = (formData: any) => {
    if (editingUser) {
      onUpdateUser(formData);
    } else {
      onCreateUser(formData);
    }
  };


  return (
    <>
      <UserFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        user={editingUser}
        currentUser={currentUser}
      />
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h2>
          <button onClick={handleCreateClick} className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Create User
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className={`w-full ${currentUser.role === Role.SUPER_ADMIN ? 'md:w-1/3' : 'md:w-1/2'}`}>
                <label htmlFor="role-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Filter by Role</label>
                <select 
                    id="role-filter"
                    value={roleFilter} 
                    onChange={e => setRoleFilter(e.target.value)}
                    className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="all">All Roles</option>
                    {Object.values(Role).map(role => <option key={role} value={role}>{role}</option>)}
                </select>
            </div>
            {currentUser.role === Role.SUPER_ADMIN && (
                <div className="w-full md:w-1/3">
                    <label htmlFor="department-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Filter by Department</label>
                    <select 
                        id="department-filter"
                        value={departmentFilter} 
                        onChange={e => setDepartmentFilter(e.target.value)}
                        className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="all">All Departments</option>
                        {Object.values(Department).map(dep => <option key={dep} value={dep}>{dep}</option>)}
                    </select>
                </div>
            )}
             <div className={`w-full ${currentUser.role === Role.SUPER_ADMIN ? 'md:w-1/3' : 'md:w-1/2'}`}>
                <label htmlFor="age-group-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Filter by Age Group</label>
                <select
                    id="age-group-filter"
                    value={ageGroupFilter}
                    onChange={e => setAgeGroupFilter(e.target.value)}
                    className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="all">All Age Groups</option>
                    {AGE_GROUPS.map(group => <option key={group} value={group}>{group}</option>)}
                </select>
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Name</th>
                <th scope="col" className="px-6 py-3">Role</th>
                <th scope="col" className="px-6 py-3">Department</th>
                <th scope="col" className="px-6 py-3">Specialization</th>
                <th scope="col" className="px-6 py-3">Age Group</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    <div className="flex items-center space-x-3">
                      <img className="w-10 h-10 rounded-full object-cover" src={user.avatarUrl} alt={`${user.firstName} ${user.fatherName}`} />
                      <div>
                        <div className="font-semibold">{user.firstName} {user.fatherName}</div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs">{user.email}</div>
                        <div className="flex items-center space-x-2 mt-2">
                            {user.socialMediaLinks?.linkedin && <a href={user.socialMediaLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500"><IconLinkedin className="w-4 h-4" /></a>}
                            {user.socialMediaLinks?.twitter && <a href={user.socialMediaLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500"><IconTwitter className="w-4 h-4" /></a>}
                            {user.socialMediaLinks?.github && <a href={user.socialMediaLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500"><IconGithub className="w-4 h-4" /></a>}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2 max-w-xs">
                            {user.skills?.slice(0, 3).map(skill => (
                                <span key={skill} className="px-2 py-0.5 text-xs rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium">
                                    {skill}
                                </span>
                            ))}
                            {user.skills && user.skills.length > 3 && (
                                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium self-center">+{user.skills.length - 3} more</span>
                            )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === Role.SUPER_ADMIN ? 'bg-red-200 text-red-800' :
                      user.role === Role.ADMIN ? 'bg-purple-200 text-purple-800' :
                      user.role === Role.MANAGER ? 'bg-blue-200 text-blue-800' :
                      user.role === Role.EMPLOYEE ? 'bg-green-200 text-green-800' :
                      'bg-gray-200 text-gray-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">{user.department}</td>
                  <td className="px-6 py-4">{user.specialization}</td>
                  <td className="px-6 py-4">{user.ageGroup}</td>
                  <td className="px-6 py-4">
                    {canManageUser(user) ? (
                      <div className="flex space-x-4">
                        <button onClick={() => handleEditClick(user)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</button>
                        <button onClick={() => handleDeleteClick(user.id)} className="font-medium text-red-600 dark:text-red-500 hover:underline">Delete</button>
                      </div>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500">No actions</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default UserManagement;