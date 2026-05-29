/**
 * Real GCEM CSE 6th Semester student data
 * College: Gopalan College of Engineering and Management, Bangalore
 */

export const BRANCHES = [
  { code: 'CSE', name: 'Computer Science & Engineering', students: 121 },
] as const;

export const SECTIONS = ['A', 'B'] as const;

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

// Real class data — GCEM CSE 6th Sem (Section A + B + Lateral Entry)
const RAW_STUDENTS: { usn: string; name: string; section: 'A' | 'B' }[] = [
  // Section A
  { usn: "1GD23CS001", name: "A S Pallavi", section: "A" },
  { usn: "1GD23CS002", name: "Abdul Shuaib", section: "A" },
  { usn: "1GD23CS003", name: "Abhishek Mannatharaj", section: "A" },
  { usn: "1GD23CS004", name: "Abhishek R", section: "A" },
  { usn: "1GD23CS005", name: "Adithya D H", section: "A" },
  { usn: "1GD23CS006", name: "Aishwarya R S", section: "A" },
  { usn: "1GD23CS007", name: "Akash", section: "A" },
  { usn: "1GD23CS008", name: "Akshay Adaka", section: "A" },
  { usn: "1GD23CS009", name: "Ambrish R", section: "A" },
  { usn: "1GD23CS010", name: "Angel Beulah K", section: "A" },
  { usn: "1GD23CS011", name: "Anusha S", section: "A" },
  { usn: "1GD23CS012", name: "Anushree M N", section: "A" },
  { usn: "1GD23CS013", name: "Ayushman Kumar", section: "A" },
  { usn: "1GD23CS014", name: "B Brunda", section: "A" },
  { usn: "1GD23CS015", name: "Bindhushree M", section: "A" },
  { usn: "1GD23CS016", name: "C S Pavan Kumar", section: "A" },
  { usn: "1GD23CS017", name: "Challa Himasree", section: "A" },
  { usn: "1GD23CS018", name: "Challa Janaki Ram Reddy", section: "A" },
  { usn: "1GD23CS020", name: "Chandana D", section: "A" },
  { usn: "1GD23CS021", name: "Chandra Prakash V", section: "A" },
  { usn: "1GD23CS023", name: "Chetan G M", section: "A" },
  { usn: "1GD23CS024", name: "Chiranjeevi A", section: "A" },
  { usn: "1GD23CS025", name: "Chitra V Gowda", section: "A" },
  { usn: "1GD23CS026", name: "Darshan A", section: "A" },
  { usn: "1GD23CS028", name: "Devadhar S Murthy", section: "A" },
  { usn: "1GD23CS029", name: "Divya D K", section: "A" },
  { usn: "1GD23CS030", name: "Divyashree C", section: "A" },
  { usn: "1GD23CS031", name: "Divyashree R M", section: "A" },
  { usn: "1GD23CS032", name: "Fayaz", section: "A" },
  { usn: "1GD23CS033", name: "Gagana C", section: "A" },
  { usn: "1GD23CS034", name: "Harini S", section: "A" },
  { usn: "1GD23CS035", name: "Harshit Raj", section: "A" },
  { usn: "1GD23CS036", name: "Harshith H R", section: "A" },
  { usn: "1GD23CS037", name: "Harshitha B A", section: "A" },
  { usn: "1GD23CS038", name: "Himani Sadanala", section: "A" },
  { usn: "1GD23CS039", name: "Jahnavi N", section: "A" },
  { usn: "1GD23CS040", name: "Janani B M", section: "A" },
  { usn: "1GD23CS042", name: "Jyesht M", section: "A" },
  { usn: "1GD23CS043", name: "K Harshini Priya", section: "A" },
  { usn: "1GD23CS044", name: "K S Bhavana", section: "A" },
  { usn: "1GD23CS045", name: "K Tarunisri Reddy", section: "A" },
  { usn: "1GD23CS046", name: "Karthik V C", section: "A" },
  { usn: "1GD23CS048", name: "Kavya S Irannanavar", section: "A" },
  { usn: "1GD23CS049", name: "Kavyashree Ponnurangam", section: "A" },
  { usn: "1GD23CS050", name: "Keerthi K P", section: "A" },
  { usn: "1GD23CS051", name: "Kondapalli Sirisha", section: "A" },
  { usn: "1GD23CS052", name: "Kreshika M", section: "A" },
  { usn: "1GD23CS053", name: "Kruthin H", section: "A" },
  { usn: "1GD23CS054", name: "Kusuma T P", section: "A" },
  { usn: "1GD23CS056", name: "M M Bharath", section: "A" },
  { usn: "1GD23CS057", name: "M Vivek", section: "A" },
  { usn: "1GD23CS058", name: "Maddela Tarun", section: "A" },
  { usn: "1GD23CS059", name: "Madhushalini", section: "A" },
  { usn: "1GD23CS060", name: "Madhuvathi K L", section: "A" },
  { usn: "1GD23CS061", name: "Mallikarjun", section: "A" },
  { usn: "1GD23CS062", name: "Manoj", section: "A" },
  { usn: "1GD24CS400", name: "Bhuvan Gowda", section: "A" },
  { usn: "1GD24CS402", name: "Dixit V", section: "A" },
  { usn: "1GD24CS403", name: "Girish S V", section: "A" },
  { usn: "1GD24CS407", name: "Rajesh G", section: "A" },
  { usn: "1GD24CS408", name: "Shivannda Swamy", section: "A" },
  { usn: "1GD24CS409", name: "Supriya", section: "A" },
  // Section B
  { usn: "1GD23CS063", name: "Maria Anushka S", section: "B" },
  { usn: "1GD23CS064", name: "Mohith S", section: "B" },
  { usn: "1GD23CS065", name: "Monalisha Nayak", section: "B" },
  { usn: "1GD23CS066", name: "Monitha Lokesh K", section: "B" },
  { usn: "1GD23CS067", name: "Mounika D G", section: "B" },
  { usn: "1GD23CS068", name: "Navya Shree S", section: "B" },
  { usn: "1GD23CS069", name: "Neha Hegde", section: "B" },
  { usn: "1GD23CS070", name: "Nithelan Jayakumar", section: "B" },
  { usn: "1GD23CS072", name: "Nithin S", section: "B" },
  { usn: "1GD23CS073", name: "Om Prakash Sahoo", section: "B" },
  { usn: "1GD23CS074", name: "P Mohan", section: "B" },
  { usn: "1GD23CS075", name: "Pavan S", section: "B" },
  { usn: "1GD23CS076", name: "P Yagna Priya", section: "B" },
  { usn: "1GD23CS077", name: "Ponnarasi", section: "B" },
  { usn: "1GD23CS079", name: "Preethi Jangir", section: "B" },
  { usn: "1GD23CS080", name: "Prince Kumar", section: "B" },
  { usn: "1GD23CS081", name: "Priya R P", section: "B" },
  { usn: "1GD23CS082", name: "Punith T N", section: "B" },
  { usn: "1GD23CS083", name: "R Gambheer", section: "B" },
  { usn: "1GD23CS084", name: "Rachana M", section: "B" },
  { usn: "1GD23CS085", name: "Rajini K R", section: "B" },
  { usn: "1GD23CS086", name: "Rakshitha M", section: "B" },
  { usn: "1GD23CS087", name: "Rakshitha M", section: "B" },
  { usn: "1GD23CS088", name: "Ranjita J B", section: "B" },
  { usn: "1GD23CS089", name: "Rithika B", section: "B" },
  { usn: "1GD23CS091", name: "Rupa Shree H V", section: "B" },
  { usn: "1GD23CS092", name: "Sahana N Reddy", section: "B" },
  { usn: "1GD23CS093", name: "Sakshi Sharma", section: "B" },
  { usn: "1GD23CS094", name: "Sakthi Mageswari V", section: "B" },
  { usn: "1GD23CS098", name: "Shreeka K", section: "B" },
  { usn: "1GD23CS099", name: "Shreeya R", section: "B" },
  { usn: "1GD23CS100", name: "Shubhashree S V", section: "B" },
  { usn: "1GD23CS101", name: "Sinchana A Padmashree", section: "B" },
  { usn: "1GD23CS102", name: "Sindhu K N", section: "B" },
  { usn: "1GD23CS104", name: "Soujanya", section: "B" },
  { usn: "1GD23CS105", name: "Spurthi G", section: "B" },
  { usn: "1GD23CS106", name: "Srujan H R", section: "B" },
  { usn: "1GD23CS107", name: "Sugain Ahamed A", section: "B" },
  { usn: "1GD23CS108", name: "Sunny Kumar Sharma", section: "B" },
  { usn: "1GD23CS109", name: "Tarun Kumar Pathak", section: "B" },
  { usn: "1GD23CS111", name: "Thanishasri S S", section: "B" },
  { usn: "1GD23CS112", name: "Thirupathi Avinash", section: "B" },
  { usn: "1GD23CS113", name: "Ujwala T S", section: "B" },
  { usn: "1GD23CS114", name: "V Sanjay", section: "B" },
  { usn: "1GD23CS115", name: "V Sushma", section: "B" },
  { usn: "1GD23CS116", name: "Varun M L", section: "B" },
  { usn: "1GD23CS117", name: "Vennela G", section: "B" },
  { usn: "1GD23CS118", name: "Venu M", section: "B" },
  { usn: "1GD23CS119", name: "Vijay Kumar K L", section: "B" },
  { usn: "1GD23CS120", name: "Vinay S", section: "B" },
  { usn: "1GD23CS121", name: "Vinayaka V", section: "B" },
  { usn: "1GD23CS122", name: "Vishakha S Panchgalle", section: "B" },
  { usn: "1GD23CS123", name: "Vivek S Kashyap", section: "B" },
  { usn: "1GD23CS124", name: "Thanusha Y P", section: "B" },
  { usn: "1GD23CS125", name: "Yogesh S", section: "B" },
  { usn: "1GD23CS126", name: "Yogesh Shankar", section: "B" },
  { usn: "1GD24CS401", name: "Chandushree D S", section: "B" },
  { usn: "1GD24CS404", name: "Keerthana A", section: "B" },
  { usn: "1GD24CS405", name: "Kumari N", section: "B" },
];

// Seed for consistent random values
function seededRandom(seed: number) {
  let s = seed;
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}

// Generate full student records from raw data
export const ALL_STUDENTS: StudentRecord[] = RAW_STUDENTS.map((s, i) => {
  const rng = seededRandom(i * 7 + 42);
  const cgpa = +(6.5 + rng() * 3.5).toFixed(2);
  const attendance = Math.round(65 + rng() * 35);
  const testsCompleted = Math.round(3 + rng() * 10);
  const avgScore = Math.round(50 + rng() * 45);

  return {
    id: `std_${i + 1}`,
    usn: s.usn,
    name: s.name,
    branch: 'CSE' as Branch,
    section: s.section as Section,
    semester: 6,
    email: `${s.usn.toLowerCase()}@gcem.edu`,
    cgpa,
    attendance,
    status: (rng() > 0.05 ? 'active' : 'inactive') as 'active' | 'inactive',
    lastActive: new Date(Date.now() - Math.round(rng() * 7 * 86400000)).toISOString().split('T')[0],
    testsCompleted,
    avgScore,
  };
});

export function getStudentStats(students: StudentRecord[]) {
  const total = students.length;
  const active = students.filter(s => s.status === 'active').length;
  const avgCgpa = total > 0 ? +(students.reduce((sum, s) => sum + s.cgpa, 0) / total).toFixed(2) : 0;
  const topPerformers = students.filter(s => s.cgpa >= 9.0).length;
  const atRisk = students.filter(s => s.cgpa < 6.0 || s.attendance < 75).length;

  return { total, active, avgCgpa, topPerformers, atRisk };
}

export function buildUSN(branch: string, year: string, seq: number): string {
  return `1GD${year}${branch.substring(0, 2).toUpperCase()}${String(seq).padStart(3, '0')}`;
}

export function nextUSNSequence(existing: StudentRecord[], branch: string, year: string): number {
  const prefix = `1GD${year}${branch.substring(0, 2).toUpperCase()}`;
  const nums = existing
    .filter(s => s.usn.startsWith(prefix))
    .map(s => parseInt(s.usn.slice(-3)))
    .filter(n => !isNaN(n));
  return nums.length > 0 ? Math.max(...nums) + 1 : 1;
}
