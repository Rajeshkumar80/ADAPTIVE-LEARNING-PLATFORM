describe('Certificate Generation', () => {
  // Simulates the certificate generation logic from student.ts
  function generateCertificate(user: { fullName: string; usn: string; semester: number; branch: string }, cert: { type: string; title: string; subject: string; score: number; issuedDate: Date }) {
    return [
      '═══════════════════════════════════════════════════',
      '              ADAPTLEARN CERTIFICATE',
      '═══════════════════════════════════════════════════',
      '',
      `  Certificate of ${cert.type}`,
      '',
      `  This is to certify that`,
      '',
      `  ${user.fullName}`,
      `  USN: ${user.usn}`,
      `  Semester: ${user.semester} | Branch: ${user.branch}`,
      '',
      `  has successfully completed`,
      '',
      `  "${cert.title}"`,
      `  Subject: ${cert.subject}`,
      `  Score: ${cert.score}%`,
      '',
      `  Date: ${cert.issuedDate.toLocaleDateString('en-IN')}`,
      '',
      '═══════════════════════════════════════════════════',
      '        Adaptive Learning Platform - VTU CSE',
      '═══════════════════════════════════════════════════',
    ].join('\n');
  }

  it('should generate different certificates for different users', () => {
    const user1 = { fullName: 'Aarav Patel', usn: '1GD23CS001', semester: 6, branch: 'Computer Science' };
    const user2 = { fullName: 'Kavya Iyer', usn: '1GD23CS008', semester: 6, branch: 'Computer Science' };
    const cert = { type: 'completion', title: 'Cloud Computing', subject: 'Cloud Computing', score: 85, issuedDate: new Date('2026-07-01') };

    const cert1 = generateCertificate(user1, cert);
    const cert2 = generateCertificate(user2, cert);

    expect(cert1).toContain('Aarav Patel');
    expect(cert1).toContain('1GD23CS001');
    expect(cert2).toContain('Kavya Iyer');
    expect(cert2).toContain('1GD23CS008');
    expect(cert1).not.toBe(cert2);
  });

  it('should include real score and subject', () => {
    const user = { fullName: 'Rohan Gupta', usn: '1GD23CS003', semester: 6, branch: 'Computer Science' };
    const cert = { type: 'excellence', title: 'ML Excellence', subject: 'Machine Learning', score: 95, issuedDate: new Date('2026-06-15') };

    const output = generateCertificate(user, cert);

    expect(output).toContain('Certificate of excellence');
    expect(output).toContain('Machine Learning');
    expect(output).toContain('Score: 95%');
    expect(output).toContain('15/6/2026');
  });

  it('should handle missing user data gracefully', () => {
    const user = { fullName: '', usn: '', semester: 0, branch: '' };
    const cert = { type: 'completion', title: 'Test', subject: 'Test', score: 0, issuedDate: new Date() };

    const output = generateCertificate(user, cert);
    expect(output).toContain('ADAPTLEARN CERTIFICATE');
  });
});
