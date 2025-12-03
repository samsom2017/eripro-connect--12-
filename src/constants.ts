
import { Role, Department, User, Message, Channel, MessageType, JobPosting, ProductivityItem, ProductivityItemType, ProductivityTargetType } from './types';

export const AGE_GROUPS = ['18-25', '26-35', '36-45', '46-55', '56+'];

export const COUNTRY_DATA: { name: string, code: string }[] = [
    { name: 'Eritrea', code: '+291' },
    { name: 'United States', code: '+1' },
    { name: 'United Kingdom', code: '+44' },
    { name: 'Canada', code: '+1' },
    { name: 'Australia', code: '+61' },
    { name: 'Germany', code: '+49' },
    { name: 'France', code: '+33' },
    { name: 'Japan', code: '+81' },
    { name: 'China', code: '+86' },
    { name: 'India', code: '+91' },
    { name: 'Brazil', code: '+55' },
    { name: 'South Africa', code: '+27' },
    { name: 'Nigeria', code: '+234' },
    { name: 'Egypt', code: '+20' },
    { name: 'Saudi Arabia', code: '+966' },
    { name: 'United Arab Emirates', code: '+971' },
    { name: 'Afghanistan', code: '+93' },
    { name: 'Albania', code: '+355' },
    { name: 'Algeria', code: '+213' },
    { name: 'Andorra', code: '+376' },
    { name: 'Angola', code: '+244' },
    { name: 'Argentina', code: '+54' },
    { name: 'Armenia', code: '+374' },
    { name: 'Austria', code: '+43' },
    { name: 'Azerbaijan', code: '+994' },
    { name: 'Bahamas', code: '+1-242' },
    { name: 'Bahrain', code: '+973' },
    { name: 'Bangladesh', code: '+880' },
    { name: 'Barbados', code: '+1-246' },
    { name: 'Belarus', code: '+375' },
    { name: 'Belgium', code: '+32' },
    { name: 'Belize', code: '+501' },
    { name: 'Benin', code: '+229' },
    { name: 'Bhutan', code: '+975' },
    { name: 'Bolivia', code: '+591' },
    { name: 'Bosnia and Herzegovina', code: '+387' },
    { name: 'Botswana', code: '+267' },
    { name: 'Brunei', code: '+673' },
    { name: 'Bulgaria', code: '+359' },
    { name: 'Burkina Faso', code: '+226' },
    { name: 'Burundi', code: '+257' },
    { name: 'Cambodia', code: '+855' },
    { name: 'Cameroon', code: '+237' },
    { name: 'Central African Republic', code: '+236' },
    { name: 'Chad', code: '+235' },
    { name: 'Chile', code: '+56' },
    { name: 'Colombia', code: '+57' },
    { name: 'Congo, Democratic Republic of the', code: '+243' },
    { name: 'Congo, Republic of the', code: '+242' },
    { name: 'Costa Rica', code: '+506' },
    { name: 'Croatia', code: '+385' },
    { name: 'Cuba', code: '+53' },
    { name: 'Cyprus', code: '+357' },
    { name: 'Czech Republic', code: '+420' },
    { name: 'Denmark', code: '+45' },
    { name: 'Djibouti', code: '+253' },
    { name: 'Dominica', code: '+1-767' },
    { name: 'Dominican Republic', code: '+1-809' },
    { name: 'Ecuador', code: '+593' },
    { name: 'El Salvador', code: '+503' },
    { name: 'Estonia', code: '+372' },
    { name: 'Ethiopia', code: '+251' },
    { name: 'Finland', code: '+358' },
    { name: 'Gabon', code: '+241' },
    { name: 'Georgia', code: '+995' },
    { name: 'Ghana', code: '+233' },
    { name: 'Greece', code: '+30' },
    { name: 'Guatemala', code: '+502' },
    { name: 'Honduras', code: '+504' },
    { name: 'Hungary', code: '+36' },
    { name: 'Iceland', code: '+354' },
    { name: 'Indonesia', code: '+62' },
    { name: 'Iran', code: '+98' },
    { name: 'Iraq', code: '+964' },
    { name: 'Ireland', code: '+353' },
    { name: 'Israel', code: '+972' },
    { name: 'Italy', code: '+39' },
    { name: 'Jamaica', code: '+1-876' },
    { name: 'Jordan', code: '+962' },
    { name: 'Kazakhstan', code: '+7' },
    { name: 'Kenya', code: '+254' },
    { name: 'Kuwait', code: '+965' },
    { name: 'Kyrgyzstan', code: '+996' },
    { name: 'Latvia', code: '+371' },
    { name: 'Lebanon', code: '+961' },
    { name: 'Liberia', code: '+231' },
    { name: 'Libya', code: '+218' },
    { name: 'Lithuania', code: '+370' },
    { name: 'Luxembourg', code: '+352' },
    { name: 'Madagascar', code: '+261' },
    { name: 'Malaysia', code: '+60' },
    { name: 'Mali', code: '+223' },
    { name: 'Malta', code: '+356' },
    { name: 'Mauritania', code: '+222' },
    { name: 'Mexico', code: '+52' },
    { name: 'Moldova', code: '+373' },
    { name: 'Monaco', code: '+377' },
    { name: 'Mongolia', code: '+976' },
    { name: 'Montenegro', code: '+382' },
    { name: 'Morocco', code: '+212' },
    { name: 'Mozambique', code: '+258' },
    { name: 'Myanmar', code: '+95' },
    { name: 'Namibia', code: '+264' },
    { name: 'Nepal', code: '+977' },
    { name: 'Netherlands', code: '+31' },
    { name: 'New Zealand', code: '+64' },
    { name: 'Nicaragua', code: '+505' },
    { name: 'Niger', code: '+227' },
    { name: 'North Korea', code: '+850' },
    { name: 'North Macedonia', code: '+389' },
    { name: 'Norway', code: '+47' },
    { name: 'Oman', code: '+968' },
    { name: 'Pakistan', code: '+92' },
    { name: 'Panama', code: '+507' },
    { name: 'Paraguay', code: '+595' },
    { name: 'Peru', code: '+51' },
    { name: 'Philippines', code: '+63' },
    { name: 'Poland', code: '+48' },
    { name: 'Portugal', code: '+351' },
    { name: 'Qatar', code: '+974' },
    { name: 'Romania', code: '+40' },
    { name: 'Russia', code: '+7' },
    { name: 'Rwanda', code: '+250' },
    { name: 'Saudi Arabia', code: '+966' },
    { name: 'Senegal', code: '+221' },
    { name: 'Serbia', code: '+381' },
    { name: 'Singapore', code: '+65' },
    { name: 'Slovakia', code: '+421' },
    { name: 'Slovenia', code: '+386' },
    { name: 'Somalia', code: '+252' },
    { name: 'South Korea', code: '+82' },
    { name: 'Spain', code: '+34' },
    { name: 'Sri Lanka', code: '+94' },
    { name: 'Sudan', code: '+249' },
    { name: 'Sweden', code: '+46' },
    { name: 'Switzerland', code: '+41' },
    { name: 'Syria', code: '+963' },
    { name: 'Taiwan', code: '+886' },
    { name: 'Tanzania', code: '+255' },
    { name: 'Thailand', code: '+66' },
    { name: 'Togo', code: '+228' },
    { name: 'Tunisia', code: '+216' },
    { name: 'Turkey', code: '+90' },
    { name: 'Uganda', code: '+256' },
    { name: 'Ukraine', code: '+380' },
    { name: 'Uruguay', code: '+598' },
    { name: 'Uzbekistan', code: '+998' },
    { name: 'Venezuela', code: '+58' },
    { name: 'Vietnam', code: '+84' },
    { name: 'Yemen', code: '+967' },
    { name: 'Zambia', code: '+260' },
    { name: 'Zimbabwe', code: '+263' }
  ].sort((a, b) => a.name.localeCompare(b.name));

export const ERITREAN_CITIES = [
    { name: 'Asmara', description: 'The capital city, known for its well-preserved Italian colonial architecture and vibrant culture.', imageId: '1018' },
    { name: 'Massawa', description: 'A historic port city on the Red Sea, famous for its beautiful islands and coral reefs.', imageId: '1015' },
    { name: 'Keren', description: 'A bustling market town, known for its diverse population and the famous camel market.', imageId: '1021' },
    { name: 'Mendefera', description: 'A historic city in the Debub region, serving as an important commercial hub.', imageId: '1022' },
    { name: 'Barentu', description: 'A major town in the Gash-Barka region, inhabited by the Kunama and Nara people.', imageId: '1024' },
    { name: 'Assab', description: 'A port city in the Southern Red Sea Region, historically significant for trade.', imageId: '1025' },
    { name: 'Dekemhare', description: 'A town in the Debub region, known for its historical sites and market.', imageId: '1026' },
    { name: 'Nakfa', description: 'A town in the Northern Red Sea region, a symbol of Eritrean resistance during the war of independence.', imageId: '1028' },
    { name: 'Adikeyh', description: 'A market town in the Debub region, near historical sites like Qohaito and Metera.', imageId: '1029' }
];

export const WELCOME_GREETINGS = [
    { lang: 'English', text: 'Welcome' },
    { lang: 'Tigrinya', text: 'መርሓባ' },
    { lang: 'Tigre', text: 'أهلا وسهلا' },
    { lang: 'Saho', text: 'Ahlan wa sahlan' },
    { lang: 'Bilen', text: 'Selam' },
    { lang: 'Afar', text: 'Gadda ge' },
    { lang: 'Kunama', text: 'MayDambe' },
    { lang: 'Nara', text: 'Abarka' },
    { lang: 'Arabic', text: 'أهلاً و سهلاً' }
];

export const USERS: User[] = [
  { id: 1, firstName: 'Samsom', fatherName: 'Dawit', email: 'e.vance@eripro.com', role: Role.SUPER_ADMIN, department: Department.EXECUTIVE, specialization: 'Platform Architect', avatarUrl: 'https://picsum.photos/id/1027/100/100', yearsOfExperience: 15, password: 'superadmin123', country: 'United States', telephone: '+1-202-555-0104', gender: 'Female', birthPlace: 'Outside Eritrea', hasEritreanId: false, wantsToWorkInEritrea: 'No', primaryGoal: 'Platform Management', ageGroup: '36-45', documentUrl: '/docs/evance_cv.pdf', bio: 'Visionary platform architect with 15 years of experience in building scalable, secure, and user-centric systems. Passionate about leveraging technology to connect professionals globally.', skills: ['System Architecture', 'TypeScript', 'React', 'Node.js', 'Cloud Infrastructure', 'Security'], socialMediaLinks: { linkedin: 'https://linkedin.com/in/eleanorvance', twitter: 'https://twitter.com/eleanorvance', github: 'https://github.com/eleanorvance' } },
  { id: 2, firstName: 'Zeray', fatherName: 'Mebrahtu', email: 'm.holloway@eripro.com', role: Role.ADMIN, department: Department.ENGINEERING, specialization: 'Security Specialist', avatarUrl: 'https://picsum.photos/id/1005/100/100', yearsOfExperience: 8, password: 'password123', country: 'United Kingdom', telephone: '+44-20-7946-0958', gender: 'Male', birthPlace: 'Outside Eritrea', hasEritreanId: false, wantsToWorkInEritrea: 'I don\'t know', primaryGoal: 'Job Seeking', ageGroup: '26-35' },
  { id: 3, firstName: 'Yordanos', fatherName: 'Yemane', email: 'c.oswald@eripro.com', role: Role.MANAGER, department: Department.MARKETING, specialization: 'Campaign Strategy', avatarUrl: 'https://picsum.photos/id/1011/100/100', yearsOfExperience: 7, password: 'password123', country: 'Canada', telephone: '+1-613-555-0162', gender: 'Female', birthPlace: 'Outside Eritrea', hasEritreanId: false, wantsToWorkInEritrea: 'Yes', workDurationInEritrea: '1-2 years', primaryGoal: 'Networking', ageGroup: '26-35', documentUrl: '/docs/coswald_resume.pdf' },
  { id: 4, firstName: 'Efrem', fatherName: 'Beraki', email: 'a.pendragon@eripro.com', role: Role.TEAM_LEAD, department: Department.SALES, specialization: 'Enterprise Accounts', avatarUrl: 'https://picsum.photos/id/1012/100/100', yearsOfExperience: 6, password: 'password123', country: 'United Kingdom', telephone: '+44-121-496-0456', gender: 'Male', birthPlace: 'Outside Eritrea', hasEritreanId: false, wantsToWorkInEritrea: 'No', primaryGoal: 'Collaboration', ageGroup: '26-35' },
  { id: 5, firstName: 'Tesfay', fatherName: 'Alem', email: 'j.smith@eripro.com', role: Role.EMPLOYEE, department: Department.ENGINEERING, specialization: 'Frontend Developer', avatarUrl: 'https://picsum.photos/id/1015/100/100', yearsOfExperience: 3, password: 'password123', country: 'Australia', telephone: '+61-2-9999-0123', gender: 'Male', birthPlace: 'Outside Eritrea', hasEritreanId: true, eritreanIdNumber: 'ER-ID-JS-015', wantsToWorkInEritrea: 'Yes', workDurationInEritrea: 'Permanently', primaryGoal: 'Job Seeking', ageGroup: '18-25', documentUrl: '/docs/jsmith_portfolio.pdf', bio: 'Creative Frontend Developer with a passion for building beautiful and intuitive user interfaces. Eager to contribute to a dynamic team and grow my skills.', skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js'], socialMediaLinks: { linkedin: 'https://linkedin.com/in/johnsmithdev', github: 'https://github.com/johnsmithdev' } },
  { id: 6, firstName: 'Winta', fatherName: 'Tesfay', email: 'r.tyler@eripro.com', role: Role.EMPLOYEE, department: Department.DESIGN, specialization: 'UI/UX Designer', avatarUrl: 'https://picsum.photos/id/1025/100/100', yearsOfExperience: 4, password: 'password123', country: 'United Kingdom', telephone: '+44-1632-960987', gender: 'Female', birthPlace: 'Inside Eritrea', hasEritreanId: true, eritreanIdNumber: 'ER-ID-RT-025', wantsToWorkInEritrea: 'Yes', workDurationInEritrea: '6-12 months', primaryGoal: 'Networking', ageGroup: '18-25' },
  { id: 7, firstName: 'Kubrom', fatherName: 'Haile', email: 'k.tanaka@eripro.com', role: Role.MANAGER, department: Department.ENGINEERING, specialization: 'Backend Infrastructure', avatarUrl: 'https://picsum.photos/id/237/100/100', yearsOfExperience: 10, password: 'password123', country: 'Japan', telephone: '+81-3-4567-8901', gender: 'Male', birthPlace: 'Outside Eritrea', hasEritreanId: false, wantsToWorkInEritrea: 'No', primaryGoal: 'Collaboration', ageGroup: '36-45' },
];

export const DEPARTMENT_HIERARCHY: Record<Department, { name: string; specializations: string[] }> = {
    [Department.ENGINEERING]: {
      name: 'Engineering',
      specializations: ['Frontend Developer', 'Backend Developer', 'Fullstack Developer', 'Cloud Engineer', 'Security Specialist', 'DevOps Engineer', 'AI/ML Engineer', 'Robotics Engineer', 'Biomedical Engineer']
    },
    [Department.HR]: {
      name: 'Human Resources',
      specializations: ['Recruiter', 'HR Generalist', 'Talent Acquisition', 'HR Business Partner', 'Compensation Analyst']
    },
    [Department.MARKETING]: {
      name: 'Marketing',
      specializations: ['Content Marketer', 'SEO Specialist', 'Social Media Manager', 'Product Marketing Manager', 'Campaign Strategy', 'Digital Strategist', 'Brand Manager']
    },
    [Department.SALES]: {
      name: 'Sales',
      specializations: ['Account Executive', 'Sales Development Rep', 'Sales Manager', 'Customer Success Manager', 'Enterprise Accounts', 'Channel Partner Manager', 'Solutions Architect']
    },
    [Department.DESIGN]: {
      name: 'Design',
      specializations: ['UI/UX Designer', 'Graphic Designer', 'Product Designer', 'Interaction Designer', 'UX Researcher', 'Motion Designer']
    },
    [Department.EXECUTIVE]: {
      name: 'Executive',
      specializations: ['Platform Architect', 'CEO', 'CTO', 'COO', 'Chief Financial Officer']
    },
    [Department.HEALTHCARE]: {
      name: 'Healthcare',
      specializations: ['Doctor', 'Nurse', 'Surgeon', 'Pharmacist', 'Medical Assistant', 'Radiologist', 'Physical Therapist', 'Dietitian']
    },
    [Department.CONSTRUCTION]: {
      name: 'Construction',
      specializations: ['Civil Engineer', 'Architect', 'Construction Manager', 'Electrician', 'Plumber', 'Safety Inspector', 'Surveyor', 'Structural Engineer']
    },
    [Department.TOURISM]: {
      name: 'Tourism',
      specializations: ['Travel Agent', 'Tour Guide', 'Hotel Manager', 'Event Planner', 'Cruise Director', 'Marketing Manager (Tourism)', 'Hospitality Consultant']
    },
    [Department.BANK]: {
      name: 'Bank',
      specializations: ['Teller', 'Loan Officer', 'Financial Advisor', 'Investment Banker', 'Branch Manager', 'Auditor', 'Risk Analyst', 'Compliance Officer']
    },
    [Department.MINING]: {
      name: 'Mining',
      specializations: ['Mining Engineer', 'Geologist', 'Blasting Technician', 'Heavy Equipment Operator', 'Safety Manager', 'Metallurgist', 'Environmental Scientist (Mining)']
    },
    [Department.HISTORY]: {
      name: 'History',
      specializations: ['Historian', 'Archivist', 'Museum Curator', 'Professor', 'Historical Consultant', 'Genealogist', 'Cultural Heritage Officer']
    },
    [Department.ARCHAEOLOGY]: {
      name: 'Archaeology',
      specializations: ['Field Archaeologist', 'Lab Analyst', 'Cultural Resource Manager', 'Conservator', 'Egyptologist', 'Paleontologist', 'GIS Specialist']
    },
    [Department.AGRICULTURE]: {
      name: 'Agriculture',
      specializations: ['Agronomist', 'Farm Manager', 'Agricultural Scientist', 'Crop Specialist', 'Soil Scientist', 'Food Scientist', 'Veterinarian']
    },
    [Department.AVIATION]: {
      name: 'Aviation',
      specializations: ['Pilot', 'Air Traffic Controller', 'Aircraft Mechanic', 'Flight Attendant', 'Aviation Manager', 'Aerospace Engineer', 'Logistics Manager']
    },
    [Department.LEGAL]: {
      name: 'Legal',
      specializations: ['Lawyer', 'Paralegal', 'Legal Secretary', 'Judge', 'Corporate Counsel', 'Intellectual Property Lawyer', 'Compliance Officer']
    },
    [Department.SPORT]: {
      name: 'Sport',
      specializations: ['Coach', 'Athlete', 'Sports Analyst', 'Team Manager', 'Physiotherapist', 'Sports Psychologist']
    },
    [Department.UNIVERSITY]: {
      name: 'University',
      specializations: ['Professor', 'Lecturer', 'Researcher', 'Dean', 'Admissions Officer', 'Librarian']
    },
    [Department.WATER_RESEARCH]: {
      name: 'Water Research',
      specializations: ['Hydrologist', 'Marine Biologist', 'Water Quality Scientist', 'Oceanographer', 'Environmental Consultant']
    },
  };

// Programmatically create a channel for each department
const departmentChannels: Channel[] = Object.values(Department).map((dep: string) => ({
  id: dep.toLowerCase().replace(/\s+/g, '-'),
  name: `# ${dep.toLowerCase()}`,
  type: 'channel',
}));

export const CHANNELS: Channel[] = [
    // System & General Channels
    { id: 'broadcast', name: '📢 Broadcast', type: 'channel', isBroadcast: true },
    { id: 'general', name: '# general', type: 'channel' },
    { id: 'random', name: '# random', type: 'channel' },
    
    // Department Channels
    ...departmentChannels,
    
    // Direct Messages
    { id: 'dm-1-6', name: 'Rose Tyler', type: 'dm', members: [1,6] },
    { id: 'dm-3-4', name: 'Arthur Pendragon', type: 'dm', members: [3,4] },
];


export const MESSAGES: Message[] = [
    { id: 1, userId: 1, channelId: 'broadcast', content: 'Big news! Our Q3 campaign launch was a massive success. Huge thanks to the marketing and sales teams!', timestamp: '10:05 AM', type: MessageType.ANNOUNCEMENT },
    { id: 2, userId: 5, channelId: 'engineering', content: 'Has anyone seen the new deployment pipeline specs?', timestamp: '10:10 AM', type: MessageType.STANDARD },
    { id: 3, userId: 2, channelId: 'engineering', content: 'Check the wiki, I just updated it.', timestamp: '10:11 AM', type: MessageType.STANDARD },
    { id: 4, userId: 6, channelId: 'random', content: 'Does anyone want to grab lunch?', timestamp: '11:30 AM', type: MessageType.STANDARD },
    { id: 5, userId: 1, channelId: 'dm-1-6', content: 'Your latest UI mockups for the dashboard are fantastic. Great work!', timestamp: '2:15 PM', type: MessageType.STANDARD },
    { id: 6, userId: 6, channelId: 'dm-1-6', content: 'Thank you! I appreciate the feedback.', timestamp: '2:16 PM', type: MessageType.STANDARD },
    { 
      id: 7, 
      userId: 2, 
      channelId: 'engineering', 
      content: {
        title: 'Senior Frontend Developer',
        company: 'EriPro Inc.',
        location: 'Remote (US)',
        description: 'Join our innovative engineering team to build the next generation of our platform. Expertise in React, TypeScript, and modern web technologies is a must.'
      } as JobPosting, 
      timestamp: '3:30 PM', 
      type: MessageType.JOB_POSTING 
    },
];

export const ROLE_HIERARCHY: Record<Role, number> = {
  [Role.SUPER_ADMIN]: 6,
  [Role.ADMIN]: 5,
  [Role.MANAGER]: 4,
  [Role.TEAM_LEAD]: 3,
  [Role.EMPLOYEE]: 2,
  [Role.USER]: 1,
};

const today = new Date();
const todayStr = today.toISOString().split('T')[0];
today.setDate(today.getDate() + 1);
const tomorrowStr = today.toISOString().split('T')[0];
today.setDate(today.getDate() - 2);
const yesterdayStr = today.toISOString().split('T')[0];


export const PRODUCTIVITY_ITEMS: ProductivityItem[] = [
  { id: 'todo-1', type: ProductivityItemType.TODO, content: 'Finalize Q3 report slides', date: todayStr, completed: false, targetType: ProductivityTargetType.PERSONAL, targetId: 3, createdBy: 3 },
  { id: 'todo-2', type: ProductivityItemType.TODO, content: 'Submit expense reports', date: todayStr, completed: true, targetType: ProductivityTargetType.PERSONAL, targetId: 5, createdBy: 5 },
  { id: 'note-1', type: ProductivityItemType.NOTE, content: 'Marketing sync meeting notes: Discussed new ad campaign strategy, budget approved for social media push.', date: yesterdayStr, completed: false, targetType: ProductivityTargetType.DEPARTMENT, targetId: Department.MARKETING, createdBy: 1 },
  { id: 'todo-3', type: ProductivityItemType.TODO, content: 'Deploy security patch v1.2.5 to staging', date: todayStr, completed: false, targetType: ProductivityTargetType.DEPARTMENT, targetId: Department.ENGINEERING, createdBy: 2 },
  { id: 'note-2', type: ProductivityItemType.NOTE, content: 'Remember to check the new UI components from Rose.', date: todayStr, completed: false, targetType: ProductivityTargetType.PERSONAL, targetId: 5, createdBy: 5 },
  { id: 'todo-4', type: ProductivityItemType.TODO, content: 'Onboarding session with the new hire', date: tomorrowStr, completed: false, targetType: ProductivityTargetType.DEPARTMENT, targetId: Department.HR, createdBy: 1 },
];