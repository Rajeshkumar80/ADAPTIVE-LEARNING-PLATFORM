/**
 * Mock student data with branches and sections for filtering
 */

export const BRANCHES = [
  { code: 'CSE', name: 'Computer Science & Engineering', students: 320 },
  { code: 'ISE', name: 'Information Science & Engineering', students: 180 },
  { code: 'ECE', name: 'Electronics & Communication', students: 240 },
  { code: 'EEE', name: 'Electrical & Electronics', students: 160 },
  { code: 'AERO', name: 'Aeronautical Engineering', students: 80 },
  { code: 'DS', name: 'Data Science', students: 120 },
  { code: 'ME', name: 'Mechanical Engineering', students: 147 },
] as const;

export const SECTIONS = ['A', 'B', 'C'] as const;

export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export type Branch = typeof BRANCHES[number]['code'];
export type Section = typeof SECTIONS[number];

export interface StudentRecord {
  id: string;
  usn: string;
  name: string;
  branch: Branch;
  section: Section;
  semester: number;
  email: string;
  cgpa: number;
  attendance: number;
  status: 'active' | 'inactive';
  lastActive: string;
  testsCompleted: number;
  avgScore: number;
}

const FIRST_NAMES = [
  'Rajesh', 'Priya', 'Amit', 'Sneha', 'Karthik', 'Anjali', 'Vikram', 'Pooja',
  'Rahul', 'Divya', 'Arjun', 'Kavita', 'Suresh', 'Meera', 'Nikhil', 'Aishwarya',
  'Rohan', 'Neha', 'Sandeep', 'Lakshmi', 'Manoj', 'Anita', 'Praveen', 'Shilpa',
  'Vinay', 'Deepa', 'Ravi', 'Pavithra', 'Kiran', 'Swathi', 'Akhil', 'Sushma',
  'Harish', 'Geetha', 'Naveen', 'Roopa', 'Mahesh', 'Tejaswi', 'Sanjay', 'Bhavana',
];

const LAST_NAMES = [
  'Kumar', 'Sharma', 'Patel', 'Reddy', 'Rao', 'Mehta', 'Singh', 'Gupta',
  'Verma', 'Iyer', 'Nair', 'Joshi', 'Babu', 'Pillai', 'Naidu', 'Bhat',
  'Hegde', 'Shenoy', 'Kamath', 'Pai', 'Krishnan', 'Subramanian', 'Murthy', 'Acharya',
];

function seedRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

// Generate consistent student data
function generateStudents(): StudentRecord[] {
  const rand = seedRandom(42);
  const students: StudentRecord[] = [];
  let counter = 1;

  for (const branch of BRANCHES) {
    for (const section of SECTIONS) {
      const perSection = Math.floor(branch.students / SECTIONS.length);
      for (let i = 0; i < perSection; i++) {
        const firstName = FIRST_NAMES[Math.floor(rand() * FIRST_NAMES.length)];
        const lastName = LAST_NAMES[Math.floor(rand() * LAST_NAMES.length)];
        const semester = 4 + Math.floor(rand() * 5); // 4-8
        const cgpa = 6.5 + rand() * 3.5;
        const attendance = 65 + Math.floor(rand() * 35);
        const isActive = rand() > 0.15;
        const branchCode = branch.code === 'CSE' ? 'CS' :
                          branch.code === 'ISE' ? 'IS' :
                          branch.code === 'ECE' ? 'EC' :
                          branch.code === 'EEE' ? 'EE' :
                          branch.code === 'AERO' ? 'AE' :
                          branch.code === 'DS' ? 'DS' : 'ME';
        const usn = `1GD23${branchCode}${String(counter).padStart(3, '0')}`;

        students.push({
          id: `std_${counter}`,
          usn,
          name: `${firstName} ${lastName}`,
          branch: branch.code,
          section,
          semester,
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@vtu.edu`,
          cgpa: Math.round(cgpa * 100) / 100,
          attendance,
          status: isActive ? 'active' : 'inactive',
          lastActive: isActive
            ? ['2 mins ago', '15 mins ago', '1 hour ago', '3 hours ago'][Math.floor(rand() * 4)]
            : ['1 day ago', '3 days ago', '1 week ago'][Math.floor(rand() * 3)],
          testsCompleted: Math.floor(rand() * 15) + 1,
          avgScore: Math.floor(60 + rand() * 40),
        });
        counter++;
      }
    }
  }

  return students;
}

export const ALL_STUDENTS = generateStudents();

// Branch code mapping for USN generation
export const BRANCH_USN_CODE: Record<Branch, string> = {
  CSE: 'CS',
  ISE: 'IS',
  ECE: 'EC',
  EEE: 'EE',
  AERO: 'AE',
  DS: 'DS',
  ME: 'ME',
};

// Build a USN like 1GD23CS001
export function buildUSN(branch: Branch, admissionYear: number, sequence: number): string {
  const yearShort = String(admissionYear).slice(-2);
  const code = BRANCH_USN_CODE[branch];
  return `1GD${yearShort}${code}${String(sequence).padStart(3, '0')}`;
}

// Find next available USN sequence for a branch + year
export function nextUSNSequence(
  students: StudentRecord[],
  branch: Branch,
  admissionYear: number
): number {
  const yearShort = String(admissionYear).slice(-2);
  const code = BRANCH_USN_CODE[branch];
  const prefix = `1GD${yearShort}${code}`;
  const used = students
    .filter(s => s.usn.startsWith(prefix))
    .map(s => parseInt(s.usn.slice(prefix.length)) || 0);
  return (used.length ? Math.max(...used) : 0) + 1;
}

export function filterStudents(filters: {
  branch?: Branch | 'all';
  section?: Section | 'all';
  semester?: number | 'all';
  status?: 'active' | 'inactive' | 'all';
  search?: string;
}): StudentRecord[] {
  return ALL_STUDENTS.filter(s => {
    if (filters.branch && filters.branch !== 'all' && s.branch !== filters.branch) return false;
    if (filters.section && filters.section !== 'all' && s.section !== filters.section) return false;
    if (filters.semester && filters.semester !== 'all' && s.semester !== filters.semester) return false;
    if (filters.status && filters.status !== 'all' && s.status !== filters.status) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!s.name.toLowerCase().includes(q) && !s.usn.toLowerCase().includes(q)) return false;
    }
    return true;
  });
}

export function getStudentStats(students: StudentRecord[]) {
  const total = students.length;
  const active = students.filter(s => s.status === 'active').length;
  const avgCgpa = total ? students.reduce((sum, s) => sum + s.cgpa, 0) / total : 0;
  const avgAttendance = total ? students.reduce((sum, s) => sum + s.attendance, 0) / total : 0;
  const avgScore = total ? students.reduce((sum, s) => sum + s.avgScore, 0) / total : 0;
  const topPerformers = students.filter(s => s.cgpa >= 9).length;
  const atRisk = students.filter(s => s.cgpa < 7 || s.attendance < 75).length;

  return {
    total,
    active,
    avgCgpa: Math.round(avgCgpa * 100) / 100,
    avgAttendance: Math.round(avgAttendance),
    avgScore: Math.round(avgScore),
    topPerformers,
    atRisk,
  };
}
