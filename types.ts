
export enum Role {
  SUPER_ADMIN = 'Super Admin',
  ADMIN = 'Admin',
  MANAGER = 'Manager',
  TEAM_LEAD = 'Team Lead',
  EMPLOYEE = 'Employee',
  USER = 'User',
}

export enum Department {
  ENGINEERING = 'Engineering',
  HR = 'Human Resources',
  MARKETING = 'Marketing',
  SALES = 'Sales',
  DESIGN = 'Design',
  EXECUTIVE = 'Executive',
  HEALTHCARE = 'Healthcare',
  CONSTRUCTION = 'Construction',
  TOURISM = 'Tourism',
  BANK = 'Bank',
  MINING = 'Mining',
  HISTORY = 'History',
  ARCHAEOLOGY = 'Archaeology',
  AGRICULTURE = 'Agriculture',
  AVIATION = 'Aviation',
  LEGAL = 'Legal',
  SPORT = 'Sport',
  UNIVERSITY = 'University',
  WATER_RESEARCH = 'Water Research',
}

export interface User {
  id: number;
  firstName: string;
  fatherName: string;
  email: string;
  role: Role;
  department: Department;
  specialization: string;
  avatarUrl: string;
  yearsOfExperience: number;
  password?: string;
  country?: string;
  telephone?: string;
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  birthPlace: 'Inside Eritrea' | 'Outside Eritrea';
  hasEritreanId: boolean;
  eritreanIdNumber?: string;
  wantsToWorkInEritrea: 'Yes' | 'No' | "I don't know";
  workDurationInEritrea?: string;
  primaryGoal: string;
  ageGroup: string;
  documentUrl?: string;
  bio?: string;
  skills?: string[];
  socialMediaLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
}

export enum MessageType {
  STANDARD = 'standard',
  ANNOUNCEMENT = 'announcement',
  JOB_POSTING = 'job_posting',
}

export interface JobPosting {
  title: string;
  company: string;
  location: string;
  description: string;
}

export interface Message {
  id: number;
  userId: number;
  channelId: string;
  content: string | JobPosting;
  timestamp: string;
  type: MessageType;
}

export interface Channel {
  id: string;
  name: string;
  type: 'channel' | 'dm';
  members?: number[]; // for DMs
  isBroadcast?: boolean;
}

// Productivity Hub Types
export enum ProductivityItemType {
  TODO = 'todo',
  NOTE = 'note',
}

export enum ProductivityTargetType {
  PERSONAL = 'personal',
  DEPARTMENT = 'department',
}

export interface ProductivityItem {
  id: string;
  type: ProductivityItemType;
  content: string;
  date: string; // YYYY-MM-DD format
  completed: boolean;
  targetType: ProductivityTargetType;
  targetId: number | Department; // userId for personal, department enum for department
  createdBy: number; // userId
}