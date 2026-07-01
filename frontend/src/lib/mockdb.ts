/**
 * Mock Database using localStorage
 * Simulates backend until PostgreSQL is set up
 */

import { ALL_STUDENTS } from './students-data';

// ============= TYPES =============
export interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  full_name: string;
  role: 'student' | 'admin';
  created_at: string;
  // Student specific
  usn?: string;
  semester?: number;
  branch?: string;
  section?: string;
  cgpa?: number;
  // Admin specific
  employee_id?: string;
  department?: string;
}

export interface Certificate {
  id: string;
  user_id: string;
  title: string;
  subject: string;
  issued_date: string;
  score: number;
  type: 'completion' | 'achievement' | 'excellence';
}

export interface Achievement {
  id: string;
  user_id: string;
  title: string;
  description: string;
  icon: string;
  earned_date: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

// ============= STORAGE KEYS =============
const KEYS = {
  CURRENT_USER: 'adaptlearn_current_user',
  USERS: 'adaptlearn_users',
  CERTIFICATES: 'adaptlearn_certificates',
  ACHIEVEMENTS: 'adaptlearn_achievements',
};

// ============= INITIAL SEED DATA =============
const seedUsers: User[] = [
  // Default Admin
  {
    id: 'adm_001',
    email: 'admin@vtu.edu',
    username: 'admin',
    password: 'admin123',
    full_name: 'Dr. Priya Sharma',
    role: 'admin',
    employee_id: 'EMP001',
    department: 'Computer Science',
    created_at: new Date().toISOString(),
  },
  // 121 GCEM students — 407 (Rajesh G) gets demo credentials
  ...ALL_STUDENTS.map(s => {
    const isDemo = s.usn === '1GD24CS407';
    return {
      id: s.id,
      email: isDemo ? 'student@vtu.edu' : s.email,
      username: isDemo ? 'student' : s.usn.toLowerCase(),
      password: isDemo ? 'student123' : s.usn.toLowerCase(),
      full_name: s.name,
      role: 'student' as const,
      usn: s.usn,
      semester: s.semester,
      branch: s.branch,
      section: s.section,
      cgpa: s.cgpa,
      created_at: new Date().toISOString(),
    };
  })
];

const seedCertificates: Certificate[] = [
  {
    id: 'cert_001',
    user_id: 'std_001',
    title: 'Data Structures Mastery',
    subject: 'Data Structures & Algorithms',
    issued_date: '2026-04-15',
    score: 92,
    type: 'excellence',
  },
  {
    id: 'cert_002',
    user_id: 'std_001',
    title: 'Database Management Expert',
    subject: 'DBMS',
    issued_date: '2026-04-22',
    score: 88,
    type: 'achievement',
  },
  {
    id: 'cert_003',
    user_id: 'std_001',
    title: 'Operating Systems Foundations',
    subject: 'Operating Systems',
    issued_date: '2026-05-01',
    score: 85,
    type: 'completion',
  },
  {
    id: 'cert_004',
    user_id: 'std_001',
    title: 'AI Workshop Completion',
    subject: 'Artificial Intelligence',
    issued_date: '2026-05-08',
    score: 95,
    type: 'excellence',
  },
];

const seedAchievements: Achievement[] = [
  { id: 'ach_001', user_id: 'std_001', title: '7-Day Streak', description: 'Studied for 7 days in a row', icon: '🔥', earned_date: '2026-05-14', rarity: 'common' },
  { id: 'ach_002', user_id: 'std_001', title: 'Perfect Score', description: 'Got 100% on a test', icon: '⭐', earned_date: '2026-04-20', rarity: 'rare' },
  { id: 'ach_003', user_id: 'std_001', title: 'Code Warrior', description: 'Made 20 journal entries', icon: '⚔️', earned_date: '2026-05-10', rarity: 'epic' },
  { id: 'ach_004', user_id: 'std_001', title: 'Top of Class', description: 'Ranked #1 in semester', icon: '🏆', earned_date: '2026-05-12', rarity: 'legendary' },
  { id: 'ach_005', user_id: 'std_001', title: 'Quiz Master', description: 'Completed 10 quizzes', icon: '🧠', earned_date: '2026-05-05', rarity: 'common' },
  { id: 'ach_006', user_id: 'std_001', title: 'Night Owl', description: 'Studied past midnight', icon: '🌙', earned_date: '2026-05-03', rarity: 'common' },
  { id: 'ach_007', user_id: 'std_001', title: 'Speed Demon', description: 'Finished test in record time', icon: '⚡', earned_date: '2026-05-09', rarity: 'rare' },
  { id: 'ach_008', user_id: 'std_001', title: 'AI Whisperer', description: 'Asked AI 50+ questions', icon: '🤖', earned_date: '2026-05-13', rarity: 'epic' },
];

// ============= INITIALIZATION =============
const SEED_VERSION = 'v5'; // Bump when seed data changes

function initStorage() {
  if (typeof window === 'undefined') return;
  
  const currentVersion = localStorage.getItem('adaptlearn_seed_version');
  if (currentVersion !== SEED_VERSION) {
    // Clear stale seed data and re-seed
    Object.values(KEYS).forEach(key => localStorage.removeItem(key));
    localStorage.setItem('adaptlearn_seed_version', SEED_VERSION);
  }

  if (!localStorage.getItem(KEYS.USERS)) {
    localStorage.setItem(KEYS.USERS, JSON.stringify(seedUsers));
  }
  if (!localStorage.getItem(KEYS.CERTIFICATES)) {
    localStorage.setItem(KEYS.CERTIFICATES, JSON.stringify(seedCertificates));
  }
  if (!localStorage.getItem(KEYS.ACHIEVEMENTS)) {
    localStorage.setItem(KEYS.ACHIEVEMENTS, JSON.stringify(seedAchievements));
  }
}

// ============= AUTH FUNCTIONS =============
export const mockDB = {
  init: initStorage,

  // Login
  login: (username: string, password: string, role: 'student' | 'admin'): User | null => {
    initStorage();
    const users: User[] = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
    const user = users.find(
      u => (u.username === username || u.email === username) && 
           u.password === password && 
           u.role === role
    );
    if (user) {
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
      return user;
    }
    return null;
  },

  // Register
  register: (data: Partial<User> & { password: string }, role: 'student' | 'admin'): User | null => {
    initStorage();
    const users: User[] = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
    
    // Check if exists
    if (users.find(u => u.email === data.email || u.username === data.username)) {
      return null;
    }

    const newUser: User = {
      id: `${role === 'student' ? 'std' : 'adm'}_${Date.now()}`,
      email: data.email!,
      username: data.username!,
      password: data.password,
      full_name: data.full_name || '',
      role,
      created_at: new Date().toISOString(),
      ...(role === 'student' ? {
        usn: data.usn || `1GD23CS${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`,
        semester: 6,
        branch: 'Computer Science',
        section: 'A',
        cgpa: 0,
      } : {
        employee_id: data.employee_id || `EMP${Math.floor(Math.random() * 1000)}`,
        department: data.department || 'Computer Science',
      }),
    };

    users.push(newUser);
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(newUser));
    return newUser;
  },

  // Logout
  logout: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(KEYS.CURRENT_USER);
  },

  // Get current user
  getCurrentUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem(KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  },

  // Get certificates for user
  getCertificates: (userId: string): Certificate[] => {
    initStorage();
    const certs: Certificate[] = JSON.parse(localStorage.getItem(KEYS.CERTIFICATES) || '[]');
    return certs.filter(c => c.user_id === userId);
  },

  // Get achievements for user
  getAchievements: (userId: string): Achievement[] => {
    initStorage();
    const achs: Achievement[] = JSON.parse(localStorage.getItem(KEYS.ACHIEVEMENTS) || '[]');
    return achs.filter(a => a.user_id === userId);
  },

  // Reset (for testing)
  reset: () => {
    if (typeof window === 'undefined') return;
    Object.values(KEYS).forEach(key => localStorage.removeItem(key));
    initStorage();
  },
};

export default mockDB;
