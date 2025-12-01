
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { User, Role, ProductivityItem, ProductivityItemType, ProductivityTargetType, Department } from '../types';
import { generateDashboardSummary } from '../services/geminiService';

interface DashboardProps {
  currentUser: User;
  productivityItems: ProductivityItem[];
  onAddItem: (item: Omit<ProductivityItem, 'id'>) => void;
  onUpdateItem: (item: ProductivityItem) => void;
  onDeleteItem: (itemId: string) => void;
}

interface Summary {
  title: string;
  summaryPoints: string[];
  recommendation: string;
}

const AISummaryCard: React.FC<{ role: Role }> = ({ role }) => {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    let summaryJson = '';
    try {
      summaryJson = await generateDashboardSummary(role);
      const parsedSummary = JSON.parse(summaryJson);
      setSummary(parsedSummary);
    } catch (e) {
      setError("Failed to parse AI summary. Please check the service.");
      console.error("Failed to parse the following JSON string from AI:", summaryJson);
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [role]);
  
  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 h-full">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">AI-Powered Summary</span>
      </h3>
      {loading ? (
        <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mt-4"></div>
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : summary ? (
        <div>
          <h4 className="font-semibold text-lg text-gray-700 dark:text-gray-300">{summary.title}</h4>
          <ul className="list-disc list-inside my-3 space-y-1 text-gray-600 dark:text-gray-400">
            {summary.summaryPoints.map((point, index) => <li key={index}>{point}</li>)}
          </ul>
          <p className="mt-4 text-sm text-gray-800 dark:text-gray-200 bg-blue-100 dark:bg-blue-900/50 p-3 rounded-lg"><span className="font-bold">Recommendation:</span> {summary.recommendation}</p>
        </div>
      ) : null}
        <button onClick={fetchSummary} disabled={loading} className="mt-4 text-xs text-gray-500 hover:text-blue-500 disabled:opacity-50">
          {loading ? 'Generating...' : 'Regenerate'}
        </button>
    </div>
  );
};

const IconChevronLeft = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>;
const IconChevronRight = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>;
const IconNote = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>;
const IconTodo = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;
const IconTrash = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>;

// Productivity Hub Implementation
const ProductivityHub: React.FC<DashboardProps> = ({ currentUser, productivityItems, onAddItem, onUpdateItem, onDeleteItem }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [departmentFilter, setDepartmentFilter] = useState<Department | 'all'>('all');

    const daysInMonth = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const date = new Date(year, month, 1);
        const days = [];
        while (date.getMonth() === month) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        return days;
    }, [currentDate]);

    const firstDayOfMonth = useMemo(() => new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(), [currentDate]);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const itemsByDate = useMemo(() => {
        return productivityItems.reduce((acc, item) => {
            (acc[item.date] = acc[item.date] || []).push(item);
            return acc;
        }, {} as Record<string, ProductivityItem[]>);
    }, [productivityItems]);

    const changeMonth = (offset: number) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() + offset);
            return newDate;
        });
    };

    const isSameDay = (d1: Date, d2: Date) => d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();

    const selectedDateItems = itemsByDate[selectedDate.toISOString().split('T')[0]] || [];
    
    const relevantItems = useMemo(() => {
        return selectedDateItems.filter(item => {
            if (item.targetType === ProductivityTargetType.PERSONAL) {
                return item.targetId === currentUser.id;
            }
            if (item.targetType === ProductivityTargetType.DEPARTMENT) {
                if (currentUser.role === Role.SUPER_ADMIN) return true;
                return item.targetId === currentUser.department;
            }
            return false;
        });
    }, [selectedDateItems, currentUser]);

    const visibleItems = useMemo(() => {
        if (currentUser.role !== Role.SUPER_ADMIN || departmentFilter === 'all') {
            return relevantItems;
        }
        return relevantItems.filter(item => {
            // Personal items are always shown regardless of department filter
            if (item.targetType === ProductivityTargetType.PERSONAL) return true;
            return item.targetId === departmentFilter;
        });
    }, [relevantItems, currentUser.role, departmentFilter]);

    const groupedItems = useMemo(() => {
        return visibleItems.reduce((acc, item) => {
            const key = item.targetType === ProductivityTargetType.PERSONAL ? "Personal" : `${item.targetId}`;
            (acc[key] = acc[key] || []).push(item);
            return acc;
        }, {} as Record<string, ProductivityItem[]>);
    }, [visibleItems]);

    const sortedGroupedItems = useMemo(() => {
        const groups = Object.entries(groupedItems);
        groups.sort(([keyA], [keyB]) => {
            if (keyA === "Personal") return -1;
            if (keyB === "Personal") return 1;
            return keyA.localeCompare(keyB);
        });
        return groups;
    }, [groupedItems]);

    const isSuperAdmin = currentUser.role === Role.SUPER_ADMIN;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 mt-8">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
                 <h3 className="text-xl font-bold text-gray-800 dark:text-white">Productivity Hub</h3>
                {isSuperAdmin && (
                    <div className="w-full sm:w-auto sm:max-w-xs">
                        <label htmlFor="hub-dept-filter" className="sr-only">Filter by Department</label>
                        <select
                            id="hub-dept-filter"
                            value={departmentFilter}
                            onChange={(e) => setDepartmentFilter(e.target.value as Department | 'all')}
                            className="w-full bg-gray-100 dark:bg-gray-700 rounded-md p-2 text-sm border-transparent focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">View All Departments</option>
                            {Object.values(Department).map(dep => <option key={dep} value={dep}>{dep}</option>)}
                        </select>
                    </div>
                )}
            </div>
            <div className="flex flex-col md:flex-row gap-6">
                {/* Calendar */}
                <div className="w-full md:w-1/3">
                    <div className="flex items-center justify-between mb-4">
                        <button onClick={() => changeMonth(-1)} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><IconChevronLeft /></button>
                        <h4 className="font-semibold text-lg">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h4>
                        <button onClick={() => changeMonth(1)} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><IconChevronRight /></button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day}>{day}</div>)}
                    </div>
                    <div className="grid grid-cols-7 gap-1 mt-2">
                        {Array(firstDayOfMonth).fill(null).map((_, i) => <div key={`empty-${i}`}></div>)}
                        {daysInMonth.map(day => {
                            const dayStr = day.toISOString().split('T')[0];
                            const hasItems = itemsByDate[dayStr];
                            const isToday = isSameDay(day, today);
                            const isSelected = isSameDay(day, selectedDate);
                            return (
                                <button key={dayStr} onClick={() => setSelectedDate(day)} className={`relative p-2 rounded-full text-sm focus:outline-none transition-colors ${isSelected ? 'bg-blue-600 text-white' : isToday ? 'bg-blue-200 dark:bg-blue-900/50' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                                    {day.getDate()}
                                    {hasItems && <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-blue-500'}`}></span>}
                                </button>
                            );
                        })}
                    </div>
                </div>
                {/* Daily View */}
                <div className="w-full md:w-2/3 md:border-l md:pl-6 border-gray-200 dark:border-gray-700">
                     <h4 className="font-semibold text-lg mb-4">
                        Tasks & Notes for <span className="text-blue-500">{selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
                    </h4>
                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                        {sortedGroupedItems.length > 0 ? sortedGroupedItems.map(([group, items]) => (
                            <div key={group}>
                                <p className="font-bold text-sm text-gray-500 dark:text-gray-400 mb-2">{group === 'Personal' ? group : `${group} Department`}</p>
                                <ul className="space-y-2">
                                    {items.map(item => (
                                        <li key={item.id} className="flex items-center bg-gray-100 dark:bg-gray-700/50 p-2 rounded-md">
                                            {item.type === ProductivityItemType.TODO ? (
                                                <input type="checkbox" checked={item.completed} onChange={e => onUpdateItem({...item, completed: e.target.checked})} className="mr-3 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                                            ) : <IconNote />}
                                            <span className={`flex-1 text-sm ${item.completed ? 'line-through text-gray-500' : ''}`}>{item.content}</span>
                                            <button onClick={() => onDeleteItem(item.id)} className="ml-2 text-gray-400 hover:text-red-500"><IconTrash /></button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                         )) : <p className="text-sm text-gray-500">No items for this day.</p>}
                    </div>
                    <ItemForm currentUser={currentUser} selectedDate={selectedDate} onAddItem={onAddItem} />
                </div>
            </div>
        </div>
    );
};

const ItemForm: React.FC<{
    currentUser: User;
    selectedDate: Date;
    onAddItem: (item: Omit<ProductivityItem, 'id'>) => void;
}> = ({ currentUser, selectedDate, onAddItem }) => {
    const [content, setContent] = useState('');
    const [type, setType] = useState<ProductivityItemType>(ProductivityItemType.TODO);
    const [target, setTarget] = useState<string>(`personal-${currentUser.id}`); // 'personal-1' or 'department-Engineering'
    
    const canCreateForDepartment = currentUser.role === Role.ADMIN || currentUser.role === Role.SUPER_ADMIN;

    useEffect(() => {
        // Reset target if user doesn't have permissions
        if (!canCreateForDepartment) {
            setTarget(`personal-${currentUser.id}`);
        } else if (currentUser.role === Role.ADMIN) {
            // Default Admin to personal, but allow department choice
             setTarget(`personal-${currentUser.id}`);
        }
    }, [canCreateForDepartment, currentUser.id, currentUser.role]);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        const [targetTypeStr, targetIdStr] = target.split('-');
        const targetType = targetTypeStr as ProductivityTargetType;
        const targetId = targetType === ProductivityTargetType.PERSONAL ? parseInt(targetIdStr, 10) : targetIdStr as Department;

        onAddItem({
            type,
            content,
            date: selectedDate.toISOString().split('T')[0],
            completed: false,
            targetType,
            targetId,
            createdBy: currentUser.id,
        });
        setContent('');
    };
    
    return (
        <form onSubmit={handleSubmit} className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
             <div className="flex items-center space-x-4">
                 <div className="flex-1">
                    <label className="sr-only">New Item</label>
                    <input type="text" value={content} onChange={e => setContent(e.target.value)} placeholder={`Add a ${type}...`} className="w-full bg-gray-100 dark:bg-gray-700 rounded-md p-2 text-sm border-transparent focus:ring-2 focus:ring-blue-500"/>
                </div>
                {canCreateForDepartment && (
                    <div>
                        <label className="sr-only">Target</label>
                        <select value={target} onChange={e => setTarget(e.target.value)} className="bg-gray-100 dark:bg-gray-700 rounded-md p-2 text-sm border-transparent focus:ring-2 focus:ring-blue-500">
                            <option value={`personal-${currentUser.id}`}>Personal</option>
                            {currentUser.role === Role.SUPER_ADMIN ? (
                                Object.values(Department).map(dep => <option key={dep} value={`department-${dep}`}>{dep}</option>)
                            ) : (
                                <option value={`department-${currentUser.department}`}>{currentUser.department}</option>
                            )}
                        </select>
                    </div>
                )}
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <label className="flex items-center text-sm"><input type="radio" name="itemType" value={ProductivityItemType.TODO} checked={type === ProductivityItemType.TODO} onChange={() => setType(ProductivityItemType.TODO)} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" /> <span className="ml-2">To-Do</span></label>
                    <label className="flex items-center text-sm"><input type="radio" name="itemType" value={ProductivityItemType.NOTE} checked={type === ProductivityItemType.NOTE} onChange={() => setType(ProductivityItemType.NOTE)} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" /> <span className="ml-2">Note</span></label>
                </div>
                <button type="submit" className="bg-blue-600 text-white font-semibold text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">Add</button>
            </div>
        </form>
    )
}

const Dashboard: React.FC<DashboardProps> = (props) => {
  const { currentUser } = props;
  
  const getRoleSpecificWidgets = () => {
    switch (currentUser.role) {
      case Role.SUPER_ADMIN:
        return <p>System health overview, tenant management stats, and global activity logs.</p>;
      case Role.ADMIN:
        return <p>User statistics, recent administrative actions, and security alerts.</p>;
      case Role.MANAGER:
        return <p>Team performance metrics, department announcements, and project progress.</p>;
      case Role.TEAM_LEAD:
        return <p>Daily team tasks, sprint burndown chart, and code review queue.</p>;
      case Role.EMPLOYEE:
        return <p>Your assigned tasks, upcoming deadlines, and recent company news.</p>;
      case Role.USER:
        return <p>Your account is pending approval. An administrator will review your registration and grant you access shortly.</p>;
      default:
        return null;
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
        Welcome back, {currentUser.firstName}!
      </h2>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
        Here's what's happening in your workspace today.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AISummaryCard role={currentUser.role} />
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 h-full">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Role-Specific View</h3>
          <div className="text-gray-600 dark:text-gray-400">
            {getRoleSpecificWidgets()}
          </div>
        </div>
      </div>
      
      <ProductivityHub {...props} />
    </div>
  );
};

export default Dashboard;
