import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
  console.log('Seeding database...');

  // Create admin
  const adminHash = bcrypt.hashSync('admin123', 12);
  await prisma.user.upsert({
    where: { email: 'admin@gcem.edu' },
    update: {},
    create: {
      email: 'admin@gcem.edu',
      username: 'admin',
      hashedPassword: adminHash,
      fullName: 'Dr. Priya Sharma',
      role: 'admin',
      employeeId: 'EMP001',
      department: 'Computer Science',
    },
  });
  console.log('  Admin created');

  // Create subjects
  const subjects = [
    { code: 'BCS601', name: 'Cloud Computing', credits: 4, semester: 6, type: 'theory' },
    { code: 'BCS602', name: 'Machine Learning', credits: 4, semester: 6, type: 'theory' },
    { code: 'BCS603', name: 'Software Testing', credits: 3, semester: 6, type: 'theory' },
    { code: 'BCS604', name: 'Cryptography and Network Security', credits: 3, semester: 6, type: 'theory' },
    { code: 'BCSL605', name: 'Machine Learning Lab', credits: 1, semester: 6, type: 'lab' },
    { code: 'BCSL606', name: 'Cloud Computing Lab', credits: 1, semester: 6, type: 'lab' },
  ];

  for (const s of subjects) {
    const sub = await prisma.subject.upsert({
      where: { code: s.code },
      update: {},
      create: s,
    });
    console.log(`  Subject ${s.code} created (id=${sub.id})`);
  }

  // Create 5 sample students
  const studentHash = bcrypt.hashSync('student123', 12);
  const sections = ['A', 'B'];
  for (let i = 1; i <= 5; i++) {
    const usn = `1GD23CS${String(i).padStart(3, '0')}`;
    const section = i <= 3 ? 'A' : 'B';
    const user = await prisma.user.upsert({
      where: { usn },
      update: {},
      create: {
        email: `${usn.toLowerCase()}@gcem.edu`,
        username: usn.toLowerCase(),
        hashedPassword: studentHash,
        fullName: `Student ${i}`,
        role: 'student',
        usn,
        semester: 6,
        branch: 'Computer Science',
        section,
        cgpa: Math.round((6.5 + Math.random() * 3) * 100) / 100,
      },
    });
    console.log(`  Student ${usn} created (id=${user.id})`);
  }

  // Create topics for BCS601 and BCS602
  const bcs601 = await prisma.subject.findUnique({ where: { code: 'BCS601' } });
  const bcs602 = await prisma.subject.findUnique({ where: { code: 'BCS602' } });

  if (bcs601) {
    const topicNames = ['Virtualization Concepts', 'Cloud Architecture', 'Cloud Storage', 'Cloud Security', 'AWS Services'];
    for (let i = 0; i < topicNames.length; i++) {
      await prisma.topic.create({ data: { subjectId: bcs601.id, name: topicNames[i], moduleNum: Math.floor(i / 2) + 1, topicNum: (i % 2) + 1 } });
    }
  }
  if (bcs602) {
    const topicNames = ['Linear Regression', 'Decision Trees', 'Neural Networks', 'SVM', 'Clustering'];
    for (let i = 0; i < topicNames.length; i++) {
      await prisma.topic.create({ data: { subjectId: bcs602.id, name: topicNames[i], moduleNum: Math.floor(i / 2) + 1, topicNum: (i % 2) + 1 } });
    }
  }
  console.log('  Topics created');

  // Create a sample test
  const test = await prisma.test.create({
    data: {
      title: 'Cloud Computing Mid-Term',
      description: 'Mid-term test on Cloud Computing',
      subjectId: bcs601?.id,
      type: 'midterm',
      difficulty: 'medium',
      durationMinutes: 90,
      totalMarks: 50,
      passingMarks: 20,
    },
  });

  const questions = [
    { q: 'What is virtualization?', a: 'Creating virtual versions of resources' },
    { q: 'Which is a cloud service model?', a: 'PaaS' },
    { q: 'What does IaaS stand for?', a: 'Infrastructure as a Service' },
    { q: 'AWS stands for?', a: 'Amazon Web Services' },
    { q: 'What is elastic computing?', a: 'Auto-scaling resources on demand' },
  ];
  for (const q of questions) {
    await prisma.question.create({
      data: { testId: test.id, questionText: q.q, correctAnswer: q.a, options: JSON.stringify([q.a, 'Option B', 'Option C', 'Option D']), marks: 10 },
    });
  }
  console.log('  Sample test with questions created');

  console.log('Seed complete!');
  await prisma.$disconnect();
}

seed().catch(console.error);
