import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function randomScore(min: number, max: number): number {
  return Math.round((min + Math.random() * (max - min)) * 10) / 10;
}

async function seed() {
  console.log('Seeding database...');

  // ========== ADMIN ==========
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

  // ========== SUBJECTS ==========
  const subjectsData = [
    { code: 'BCS601', name: 'Cloud Computing', credits: 4, semester: 6, type: 'theory' },
    { code: 'BCS602', name: 'Machine Learning', credits: 4, semester: 6, type: 'theory' },
    { code: 'BCS603', name: 'Software Testing', credits: 3, semester: 6, type: 'theory' },
    { code: 'BCS604', name: 'Cryptography and Network Security', credits: 3, semester: 6, type: 'theory' },
    { code: 'BCSL605', name: 'Machine Learning Lab', credits: 1, semester: 6, type: 'lab' },
    { code: 'BCSL606', name: 'Cloud Computing Lab', credits: 1, semester: 6, type: 'lab' },
  ];

  const subjectMap: Record<string, number> = {};
  for (const s of subjectsData) {
    const sub = await prisma.subject.upsert({
      where: { code: s.code },
      update: {},
      create: s,
    });
    subjectMap[s.code] = sub.id;
  }
  console.log('  Subjects created');

  // ========== STUDENTS ==========
  const studentHash = bcrypt.hashSync('student123', 12);
  const studentNames = [
    'Aarav Patel', 'Diya Sharma', 'Rohan Gupta', 'Ananya Singh', 'Vikram Kumar',
    'Neha Reddy', 'Arjun Nair', 'Kavya Iyer', 'Aditya Verma', 'Priyanka Das',
  ];
  const students: { id: number; usn: string; fullName: string; section: string }[] = [];

  for (let i = 1; i <= 10; i++) {
    const usn = `1GD23CS${String(i).padStart(3, '0')}`;
    const section = i <= 5 ? 'A' : 'B';
    const user = await prisma.user.upsert({
      where: { usn },
      update: {},
      create: {
        email: `${usn.toLowerCase()}@gcem.edu`,
        username: usn.toLowerCase(),
        hashedPassword: studentHash,
        fullName: studentNames[i - 1],
        role: 'student',
        usn,
        semester: 6,
        branch: 'Computer Science',
        section,
        cgpa: randomScore(6.5, 9.8),
      },
    });
    students.push({ id: user.id, usn, fullName: user.fullName, section });
  }
  console.log('  10 students created');

  // ========== TOPICS ==========
  const allTopics: { id: number; subjectId: number; name: string }[] = [];

  const topicSets: Record<string, string[]> = {
    'BCS601': ['Virtualization Concepts', 'Cloud Architecture', 'Cloud Storage', 'Cloud Security', 'AWS Services'],
    'BCS602': ['Linear Regression', 'Decision Trees', 'Neural Networks', 'Support Vector Machines', 'Clustering Algorithms'],
    'BCS603': ['Testing Fundamentals', 'Unit Testing', 'Integration Testing', 'Test Automation', 'Performance Testing'],
    'BCS604': ['Symmetric Encryption', 'Asymmetric Encryption', 'Hash Functions', 'Digital Signatures', 'TLS/SSL Protocol'],
  };

  for (const [code, names] of Object.entries(topicSets)) {
    const subId = subjectMap[code];
    if (!subId) continue;
    for (let i = 0; i < names.length; i++) {
      const topic = await prisma.topic.create({
        data: { subjectId: subId, name: names[i], moduleNum: Math.floor(i / 2) + 1, topicNum: (i % 2) + 1 },
      });
      allTopics.push({ id: topic.id, subjectId: subId, name: names[i] });
    }
  }
  console.log('  Topics created');

  // ========== TOPIC DEPENDENCIES ==========
  const cloudTopics = allTopics.filter(t => t.subjectId === subjectMap['BCS601']);
  const mlTopics = allTopics.filter(t => t.subjectId === subjectMap['BCS602']);
  const testTopics = allTopics.filter(t => t.subjectId === subjectMap['BCS603']);
  const cryptoTopics = allTopics.filter(t => t.subjectId === subjectMap['BCS604']);

  const dependencyPairs = [
    ...cloudTopics.slice(1).map((t, i) => ({ topicId: t.id, prerequisiteId: cloudTopics[i].id, threshold: 0.5 })),
    ...mlTopics.slice(1).map((t, i) => ({ topicId: t.id, prerequisiteId: mlTopics[i].id, threshold: 0.5 })),
    ...testTopics.slice(1).map((t, i) => ({ topicId: t.id, prerequisiteId: testTopics[i].id, threshold: 0.5 })),
    ...cryptoTopics.slice(1).map((t, i) => ({ topicId: t.id, prerequisiteId: cryptoTopics[i].id, threshold: 0.5 })),
  ];

  for (const d of dependencyPairs) {
    await prisma.topicDependency.upsert({
      where: { topicId_prerequisiteId: { topicId: d.topicId, prerequisiteId: d.prerequisiteId } },
      update: { threshold: d.threshold },
      create: d,
    });
  }
  console.log('  Topic dependencies created');

  // ========== TESTS WITH QUESTIONS ==========
  const testsData = [
    { title: 'Cloud Computing Mid-Term', code: 'BCS601', type: 'midterm', difficulty: 'medium', duration: 90, total: 50, passing: 20 },
    { title: 'Machine Learning Quiz 1', code: 'BCS602', type: 'quiz', difficulty: 'easy', duration: 30, total: 30, passing: 12 },
    { title: 'Software Testing Assignment', code: 'BCS603', type: 'assignment', difficulty: 'medium', duration: 60, total: 40, passing: 16 },
    { title: 'Cryptography Final Exam', code: 'BCS604', type: 'final', difficulty: 'hard', duration: 120, total: 100, passing: 40 },
    { title: 'ML Concepts Quick Test', code: 'BCS602', type: 'quiz', difficulty: 'easy', duration: 20, total: 20, passing: 8 },
    { title: 'Cloud Architecture Quiz', code: 'BCS601', type: 'quiz', difficulty: 'medium', duration: 30, total: 30, passing: 12 },
  ];

  const questionBank: Record<string, { q: string; a: string; opts: string[] }[]> = {
    'BCS601': [
      { q: 'What is virtualization?', a: 'Creating virtual versions of resources', opts: ['Creating virtual versions of resources', 'Physical hardware replication', 'Network protocol', 'Database management'] },
      { q: 'Which is a cloud service model?', a: 'PaaS', opts: ['PaaS', 'HTTP', 'TCP', 'SQL'] },
      { q: 'What does IaaS stand for?', a: 'Infrastructure as a Service', opts: ['Infrastructure as a Service', 'Internet as a Service', 'Integration as a Service', 'Information as a Service'] },
      { q: 'AWS stands for?', a: 'Amazon Web Services', opts: ['Amazon Web Services', 'Advanced Web System', 'Auto Web Sync', 'Applied Web Solution'] },
      { q: 'What is elastic computing?', a: 'Auto-scaling resources on demand', opts: ['Auto-scaling resources on demand', 'Fixed resource allocation', 'Manual server management', 'Static website hosting'] },
      { q: 'Which is a cloud deployment model?', a: 'Private Cloud', opts: ['Private Cloud', 'Desktop Cloud', 'Local Cloud', 'Basic Cloud'] },
      { q: 'What is serverless computing?', a: 'Running code without managing servers', opts: ['Running code without managing servers', 'Using physical servers only', 'Cloud gaming', 'Data compression'] },
      { q: 'What is Docker used for?', a: 'Containerization', opts: ['Containerization', 'Web browsing', 'Email sending', 'File editing'] },
    ],
    'BCS602': [
      { q: 'What is supervised learning?', a: 'Learning with labeled data', opts: ['Learning with labeled data', 'Learning without data', 'Unsupervised clustering', 'Reinforcement learning'] },
      { q: 'What does SVM stand for?', a: 'Support Vector Machine', opts: ['Support Vector Machine', 'Simple Variable Model', 'System Verification Method', 'Statistical Variance Metric'] },
      { q: 'What is overfitting?', a: 'Model performs well on training but poorly on test data', opts: ['Model performs well on training but poorly on test data', 'Model underperforms everywhere', 'Model has too few parameters', 'Model processes data slowly'] },
      { q: 'What is a decision tree?', a: 'A tree-like model of decisions', opts: ['A tree-like model of decisions', 'A data structure for sorting', 'A type of neural network', 'A database index'] },
      { q: 'What is gradient descent?', a: 'An optimization algorithm', opts: ['An optimization algorithm', 'A classification method', 'A data preprocessing step', 'A visualization technique'] },
      { q: 'What is a neural network?', a: 'A network inspired by biological neurons', opts: ['A network inspired by biological neurons', 'A computer network', 'A social network', 'A mesh network'] },
    ],
    'BCS603': [
      { q: 'What is unit testing?', a: 'Testing individual components', opts: ['Testing individual components', 'Testing the entire system', 'Testing user interfaces', 'Testing network connections'] },
      { q: 'What is integration testing?', a: 'Testing combined components', opts: ['Testing combined components', 'Testing single functions', 'Testing hardware', 'Testing databases only'] },
      { q: 'What is test automation?', a: 'Using tools to run tests automatically', opts: ['Using tools to run tests automatically', 'Manual test execution', 'Hiring more testers', 'Writing test plans'] },
      { q: 'What is regression testing?', a: 'Re-testing after changes to ensure no new bugs', opts: ['Re-testing after changes to ensure no new bugs', 'First-time testing', 'Performance benchmarking', 'User acceptance testing'] },
      { q: 'What is TDD?', a: 'Test-Driven Development', opts: ['Test-Driven Development', 'Total Data Distribution', 'Technical Design Document', 'Time-Dependent Delivery'] },
    ],
    'BCS604': [
      { q: 'What is symmetric encryption?', a: 'Same key for encryption and decryption', opts: ['Same key for encryption and decryption', 'Different keys for each', 'No key needed', 'Public key only'] },
      { q: 'What does RSA stand for?', a: 'Rivest-Shamir-Adleman', opts: ['Rivest-Shamir-Adleman', 'Random Security Algorithm', 'Remote System Access', 'Rapid Signal Analysis'] },
      { q: 'What is a hash function?', a: 'Fixed-length output from variable-length input', opts: ['Fixed-length output from variable-length input', 'Variable-length encryption', 'Key exchange protocol', 'Digital certificate'] },
      { q: 'What is a digital signature?', a: 'Electronically signed data for verification', opts: ['Electronically signed data for verification', 'Handwritten signature scan', 'Digital watermark', 'Encrypted password'] },
      { q: 'What is a man-in-the-middle attack?', a: 'Attacker intercepts communication between two parties', opts: ['Attacker intercepts communication between two parties', 'Physical theft of server', 'Password guessing', 'Denial of service'] },
    ],
  };

  const testIds: number[] = [];
  for (const t of testsData) {
    const subId = subjectMap[t.code];
    const test = await prisma.test.create({
      data: {
        title: t.title,
        description: `${t.title} for ${t.code}`,
        subjectId: subId,
        type: t.type,
        difficulty: t.difficulty,
        durationMinutes: t.duration,
        totalMarks: t.total,
        passingMarks: t.passing,
      },
    });
    testIds.push(test.id);

    const questions = questionBank[t.code] || [];
    for (const q of questions) {
      await prisma.question.create({
        data: {
          testId: test.id,
          questionText: q.q,
          correctAnswer: q.a,
          options: JSON.stringify(q.opts),
          marks: Math.round(t.total / questions.length),
          difficulty: t.difficulty,
        },
      });
    }
  }
  console.log('  Tests with questions created');

  // ========== TOPIC MASTERY (BKT) for all students ==========
  for (const student of students) {
    for (const topic of allTopics) {
      const mastery = randomScore(10, 95);
      const observations = Math.floor(Math.random() * 15) + 1;
      await prisma.topicMastery.create({
        data: {
          userId: student.id,
          topicId: topic.id,
          mastery,
          forgettingRisk: mastery < 30 ? 'high' : mastery < 60 ? 'medium' : 'low',
          pKnow: mastery / 100,
          pGuess: 0.25,
          pSlip: 0.1,
          pTransit: 0.1,
          observations,
          lastReviewed: daysAgo(Math.floor(Math.random() * 14)),
        },
      });
    }
  }
  console.log('  Topic mastery seeded for all students');

  // ========== SPACED REPETITION CARDS ==========
  for (const student of students) {
    const studentTopics = allTopics.filter(() => Math.random() > 0.3);
    for (const topic of studentTopics) {
      const easeFactor = randomScore(1.5, 3.5);
      const interval = Math.floor(Math.random() * 30);
      const repetitions = Math.floor(Math.random() * 10);
      const nextDays = Math.floor(Math.random() * 14) - 3;
      await prisma.spacedRepetitionCard.upsert({
        where: { userId_topicId: { userId: student.id, topicId: topic.id } },
        update: {},
        create: {
          userId: student.id,
          topicId: topic.id,
          easeFactor,
          interval,
          repetitions,
          nextReview: daysAgo(-nextDays),
          lastReview: daysAgo(Math.floor(Math.random() * 7)),
        },
      });
    }
  }
  console.log('  Spaced repetition cards created');

  // ========== LEARNING EVENTS for all students ==========
  const eventTypes = ['quiz_attempt', 'time_spent', 'mastery_update'] as const;
  const activityTypes = ['reading', 'quiz', 'flashcard', 'practice', 'video', 'discussion'] as const;

  for (const student of students) {
    for (let day = 0; day < 30; day++) {
      const numEvents = Math.floor(Math.random() * 4) + 1;
      for (let e = 0; e < numEvents; e++) {
        const topic = allTopics[Math.floor(Math.random() * allTopics.length)];
        const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
        let payload: Record<string, any> = {};

        if (eventType === 'quiz_attempt') {
          const score = Math.floor(Math.random() * 40) + 60;
          const total = 5;
          const correct = Math.round(score / 100 * total);
          payload = { score, correct, total, duration_seconds: 60 + Math.floor(Math.random() * 180) };
        } else if (eventType === 'time_spent') {
          payload = { duration_minutes: 15 + Math.floor(Math.random() * 60), activity: activityTypes[Math.floor(Math.random() * activityTypes.length)], focus_score: 40 + Math.floor(Math.random() * 60) };
        } else {
          payload = { mastery: randomScore(20, 95), change: randomScore(-10, 15) };
        }

        await prisma.learningEvent.create({
          data: {
            userId: student.id,
            eventType,
            topicId: topic.id,
            subjectId: topic.subjectId,
            payload: JSON.stringify(payload),
            createdAt: daysAgo(day),
          },
        });
      }
    }
  }
  console.log('  Learning events seeded for all students');

  // ========== STUDY SESSIONS for all students ==========
  for (const student of students) {
    for (let day = 0; day < 21; day++) {
      const numSessions = Math.floor(Math.random() * 3) + 1;
      for (let s = 0; s < numSessions; s++) {
        const topic = allTopics[Math.floor(Math.random() * allTopics.length)];
        const start = daysAgo(day);
        start.setHours(9 + Math.floor(Math.random() * 12));
        start.setMinutes(Math.floor(Math.random() * 60));
        const duration = 15 + Math.floor(Math.random() * 90);

        await prisma.studySession.create({
          data: {
            userId: student.id,
            subjectId: topic.subjectId,
            topicId: topic.id,
            startedAt: start,
            endedAt: new Date(start.getTime() + duration * 60000),
            durationMinutes: duration,
            focusScore: randomScore(40, 98),
            notes: `${topic.name} study session - Day ${day + 1}`,
          },
        });
      }
    }
  }
  console.log('  Study sessions seeded for all students');

  // ========== TEST ATTEMPTS for all students ==========
  for (const student of students) {
    for (const testId of testIds) {
      if (Math.random() > 0.25) {
        const score = randomScore(30, 98);
        const started = daysAgo(Math.floor(Math.random() * 20));
        const submitted = new Date(started.getTime() + Math.floor(Math.random() * 3600000) + 600000);

        const attempt = await prisma.testAttempt.create({
          data: {
            userId: student.id,
            testId,
            startedAt: started,
            submittedAt: submitted,
            score,
            answers: JSON.stringify({}),
            isCompleted: true,
          },
        });

        await prisma.learningEvent.create({
          data: {
            userId: student.id,
            eventType: 'quiz_attempt',
            testAttemptId: attempt.id,
            subjectId: allTopics[0].subjectId,
            payload: JSON.stringify({ score, total: 100, duration_seconds: Math.floor(Math.random() * 3600) }),
            createdAt: submitted,
          },
        });
      }
    }
  }
  console.log('  Test attempts seeded');

  // ========== JOURNAL ENTRIES for student 1 ==========
  const journalStudent = students[0];
  const journalEntries = [
    { title: 'Studied Cloud Architecture today', content: 'Reviewed IaaS, PaaS, and SaaS models. Need to practice more AWS questions.', mood: 'productive', tags: '["cloud", "study"]' },
    { title: 'Machine Learning - Neural Networks', content: 'Covered backpropagation and gradient descent. The math is challenging but interesting.', mood: 'neutral', tags: '["ml", "neural-networks"]' },
    { title: 'Great progress on Cryptography!', content: 'Finally understood RSA encryption. The key generation process makes sense now.', mood: 'happy', tags: '["crypto", "rsa", "milestone"]' },
    { title: 'Struggling with SVM margins', content: 'Hard margin vs soft margin is confusing. Need to revisit the math behind kernel tricks.', mood: 'frustrated', tags: '["ml", "svm", "struggle"]' },
    { title: 'Completed practice test', content: 'Scored 78% on Cloud Computing practice test. Need to improve on security topics.', mood: 'productive', tags: '["cloud", "test", "assessment"]' },
    { title: 'Review session with classmates', content: 'Group study for Software Testing. Explained TDD concepts to others which helped my understanding.', mood: 'happy', tags: '["testing", "group-study", "tdd"]' },
    { title: 'Weekly reflection', content: 'Good week overall. Mastered 3 new topics. Need to focus more on clustering algorithms in ML.', mood: 'neutral', tags: '["reflection", "weekly"]' },
  ];

  for (let i = 0; i < journalEntries.length; i++) {
    await prisma.journalEntry.create({
      data: {
        userId: journalStudent.id,
        title: journalEntries[i].title,
        content: journalEntries[i].content,
        mood: journalEntries[i].mood,
        tags: journalEntries[i].tags,
        starred: i % 3 === 0,
        createdAt: daysAgo(i * 2),
      },
    });
  }
  console.log('  Journal entries created');

  // ========== ACHIEVEMENTS for all students ==========
  const achievementDefs = [
    { title: 'First Steps', description: 'Completed your first study session', icon: '🎯', rarity: 'common' },
    { title: 'Quick Learner', description: 'Scored 90%+ on a quiz', icon: '⚡', rarity: 'rare' },
    { title: 'Bookworm', description: 'Studied for 10+ hours in a week', icon: '📚', rarity: 'common' },
    { title: 'Perfect Score', description: 'Got 100% on any test', icon: '💯', rarity: 'epic' },
    { title: 'Streak Master', description: 'Maintained a 7-day study streak', icon: '🔥', rarity: 'rare' },
    { title: 'Subject Expert', description: 'Mastered all topics in a subject', icon: '🏆', rarity: 'legendary' },
    { title: 'Quiz Champion', description: 'Completed 20 quizzes', icon: '🏅', rarity: 'rare' },
    { title: 'Collaborator', description: 'Participated in group study', icon: '🤝', rarity: 'common' },
    { title: 'Night Owl', description: 'Studied past midnight', icon: '🦉', rarity: 'common' },
    { title: 'Early Bird', description: 'Started studying before 7 AM', icon: '🐦', rarity: 'common' },
    { title: 'Consistent Performer', description: 'Maintained 80%+ average for a month', icon: '📈', rarity: 'epic' },
    { title: 'Polyglot', description: 'Studied 3+ subjects in one day', icon: '🌍', rarity: 'rare' },
  ];

  for (const student of students) {
    const numAchievements = 3 + Math.floor(Math.random() * 8);
    const shuffled = [...achievementDefs].sort(() => Math.random() - 0.5);
    for (let i = 0; i < numAchievements && i < shuffled.length; i++) {
      await prisma.achievement.create({
        data: {
          userId: student.id,
          title: shuffled[i].title,
          description: shuffled[i].description,
          icon: shuffled[i].icon,
          rarity: shuffled[i].rarity,
          earnedDate: daysAgo(Math.floor(Math.random() * 30)),
        },
      });
    }
  }
  console.log('  Achievements created');

  // ========== CERTIFICATES for all students ==========
  const certDefs = [
    { title: 'Cloud Computing - Course Completion', subject: 'Cloud Computing', type: 'completion' },
    { title: 'Machine Learning - Excellence Award', subject: 'Machine Learning', type: 'excellence' },
    { title: 'Software Testing - Assignment Master', subject: 'Software Testing', type: 'achievement' },
    { title: 'Cryptography - Security Expert', subject: 'Cryptography and Network Security', type: 'achievement' },
    { title: 'Cloud Computing - AWS Basics', subject: 'Cloud Computing', type: 'completion' },
  ];

  for (const student of students) {
    const numCerts = 1 + Math.floor(Math.random() * 4);
    const shuffled = [...certDefs].sort(() => Math.random() - 0.5);
    for (let i = 0; i < numCerts && i < shuffled.length; i++) {
      await prisma.certificate.create({
        data: {
          userId: student.id,
          title: shuffled[i].title,
          subject: shuffled[i].subject,
          type: shuffled[i].type,
          score: randomScore(70, 100),
          issuedDate: daysAgo(Math.floor(Math.random() * 30)),
        },
      });
    }
  }
  console.log('  Certificates created');

  // ========== NOTIFICATIONS ==========
  const notificationDefs = [
    { title: 'Welcome to AdaptLearn', message: 'Your adaptive learning platform is ready. Start exploring your courses!', type: 'success', category: 'system' },
    { title: 'New Test Available', message: 'Cloud Computing Mid-Term has been published. Take it before the deadline.', type: 'info', category: 'test' },
    { title: 'Study Reminder', message: 'You have topics due for review in Machine Learning. Keep up your streak!', type: 'warning', category: 'reminder' },
    { title: 'Achievement Unlocked', message: 'Congratulations! You earned the "First Steps" achievement.', type: 'success', category: 'achievement' },
    { title: 'Assignment Deadline', message: 'Software Testing Assignment is due in 3 days. Submit your work on time.', type: 'warning', category: 'deadline' },
    { title: 'Weekly Report Ready', message: 'Your weekly learning report is available. Check your analytics for insights.', type: 'info', category: 'report' },
    { title: 'New Course Material', message: 'New study materials have been added to Cryptography and Network Security.', type: 'info', category: 'course' },
    { title: 'System Maintenance', message: 'Scheduled maintenance on Saturday 2 AM - 4 AM. Plan accordingly.', type: 'error', category: 'system' },
  ];

  for (const nd of notificationDefs) {
    const notification = await prisma.notification.create({
      data: { title: nd.title, message: nd.message, type: nd.type, category: nd.category, target: 'all' },
    });
    for (const student of students) {
      await prisma.userNotification.create({
        data: { notificationId: notification.id, userId: student.id, read: Math.random() > 0.5 },
      });
    }
  }
  console.log('  Notifications created');

  // ========== ANTI-CHEAT FLAGS ==========
  for (const student of students.slice(0, 3)) {
    const attempts = await prisma.testAttempt.findMany({ where: { userId: student.id }, take: 2 });
    for (const attempt of attempts) {
      if (Math.random() > 0.5) {
        await prisma.antiCheatFlag.create({
          data: {
            testAttemptId: attempt.id,
            userId: student.id,
            severity: Math.random() > 0.7 ? 'warning' : 'info',
            violation: Math.random() > 0.5 ? 'Tab switch detected' : 'Copy-paste attempted',
            count: Math.floor(Math.random() * 3) + 1,
          },
        });
      }
    }
  }
  console.log('  Anti-cheat flags created');

  console.log('\nSeed complete!');
  await prisma.$disconnect();
}

seed().catch(console.error);
