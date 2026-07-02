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

  // Create topics for Cloud Computing and Machine Learning
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

  // Create topic dependencies (prerequisite graph)
  const allTopics = await prisma.topic.findMany();
  const cloudTopics = allTopics.filter(t => t.subjectId === bcs601?.id);
  const mlTopics = allTopics.filter(t => t.subjectId === bcs602?.id);

  // Cloud: Architecture depends on Virtualization, Storage depends on Architecture, etc.
  if (cloudTopics.length >= 3) {
    const deps = [
      { topicId: cloudTopics[1].id, prerequisiteId: cloudTopics[0].id, threshold: 0.5 },
      { topicId: cloudTopics[2].id, prerequisiteId: cloudTopics[1].id, threshold: 0.6 },
      { topicId: cloudTopics[3].id, prerequisiteId: cloudTopics[2].id, threshold: 0.7 },
      { topicId: cloudTopics[4].id, prerequisiteId: cloudTopics[1].id, threshold: 0.5 },
    ];
    for (const d of deps) {
      await prisma.topicDependency.upsert({
        where: { topicId_prerequisiteId: { topicId: d.topicId, prerequisiteId: d.prerequisiteId } },
        update: { threshold: d.threshold },
        create: d,
      });
    }
  }
  // ML: Neural Nets depends on Linear Reg, SVM depends on Linear Reg
  if (mlTopics.length >= 3) {
    const deps = [
      { topicId: mlTopics[1].id, prerequisiteId: mlTopics[0].id, threshold: 0.5 },
      { topicId: mlTopics[2].id, prerequisiteId: mlTopics[0].id, threshold: 0.6 },
      { topicId: mlTopics[3].id, prerequisiteId: mlTopics[0].id, threshold: 0.6 },
      { topicId: mlTopics[4].id, prerequisiteId: mlTopics[1].id, threshold: 0.5 },
    ];
    for (const d of deps) {
      await prisma.topicDependency.upsert({
        where: { topicId_prerequisiteId: { topicId: d.topicId, prerequisiteId: d.prerequisiteId } },
        update: { threshold: d.threshold },
        create: d,
      });
    }
  }
  console.log('  Topic dependencies created');

  // Seed sample learning events for student 1
  const student1 = await prisma.user.findUnique({ where: { usn: '1GD23CS001' } });
  if (student1 && cloudTopics.length > 0 && mlTopics.length > 0) {
    // Quiz attempts
    for (let i = 0; i < 8; i++) {
      const topic = i < 4 ? cloudTopics[i % cloudTopics.length] : mlTopics[i % mlTopics.length];
      const score = 50 + Math.floor(Math.random() * 50);
      const correct = Math.round(score / 100 * 5);
      await prisma.learningEvent.create({
        data: {
          userId: student1.id,
          eventType: 'quiz_attempt',
          topicId: topic.id,
          subjectId: topic.subjectId,
          payload: JSON.stringify({ score, correct, total: 5, duration_seconds: 60 + Math.floor(Math.random() * 120) }),
        },
      });
    }
    // Study sessions
    for (let i = 0; i < 10; i++) {
      const topic = i < 5 ? cloudTopics[i % cloudTopics.length] : mlTopics[i % mlTopics.length];
      const activities = ['reading', 'quiz', 'flashcard', 'practice', 'video'] as const;
      await prisma.learningEvent.create({
        data: {
          userId: student1.id,
          eventType: 'time_spent',
          topicId: topic.id,
          subjectId: topic.subjectId,
          payload: JSON.stringify({ duration_minutes: 15 + Math.floor(Math.random() * 45), activity: activities[i % 5], focus_score: 40 + Math.floor(Math.random() * 60) }),
        },
      });
      await prisma.studySession.create({
        data: {
          userId: student1.id,
          subjectId: topic.subjectId,
          topicId: topic.id,
          durationMinutes: 15 + Math.floor(Math.random() * 45),
          focusScore: 40 + Math.floor(Math.random() * 60),
        },
      });
    }
    console.log('  Sample learning events seeded for student 1');
  }

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
