describe('Leaderboard Tie-Break', () => {
  // Simulates the leaderboard sort logic from student.ts
  function sortByCgpa(students: { usn: string; name: string; cgpa: number; section: string }[]) {
    return [...students].sort((a, b) => b.cgpa - a.cgpa || a.usn.localeCompare(b.usn));
  }

  function sortByTestScore(students: { usn: string; name: string; avg_score: number; section: string }[]) {
    return [...students].sort((a, b) => b.avg_score - a.avg_score || a.usn.localeCompare(b.usn));
  }

  it('should sort by CGPA descending, with USN ascending as tie-break', () => {
    const students = [
      { usn: '1GD23CS003', name: 'Rohan', cgpa: 9.4, section: 'A' },
      { usn: '1GD23CS006', name: 'Neha', cgpa: 9.4, section: 'B' },
      { usn: '1GD23CS001', name: 'Aarav', cgpa: 9.3, section: 'A' },
      { usn: '1GD23CS008', name: 'Kavya', cgpa: 9.7, section: 'B' },
    ];

    const sorted = sortByCgpa(students);

    // Kavya (9.7) first, then Neha (9.4, USN 006) before Rohan (9.4, USN 003)... wait
    // Actually 003 < 006 alphabetically, so Rohan comes first
    expect(sorted[0].usn).toBe('1GD23CS008'); // 9.7
    expect(sorted[1].usn).toBe('1GD23CS003'); // 9.4, USN 003 < 006
    expect(sorted[2].usn).toBe('1GD23CS006'); // 9.4, USN 006 > 003
    expect(sorted[3].usn).toBe('1GD23CS001'); // 9.3
  });

  it('should sort by test score descending, with USN ascending as tie-break', () => {
    const students = [
      { usn: '1GD23CS005', name: 'Vikram', avg_score: 63, section: 'A' },
      { usn: '1GD23CS010', name: 'Priyanka', avg_score: 63, section: 'B' },
      { usn: '1GD23CS001', name: 'Aarav', avg_score: 84, section: 'A' },
    ];

    const sorted = sortByTestScore(students);

    expect(sorted[0].usn).toBe('1GD23CS001'); // 84
    expect(sorted[1].usn).toBe('1GD23CS005'); // 63, USN 005 < 010
    expect(sorted[2].usn).toBe('1GD23CS010'); // 63, USN 010 > 005
  });

  it('should handle single student', () => {
    const students = [{ usn: '1GD23CS001', name: 'Aarav', cgpa: 9.3, section: 'A' }];
    const sorted = sortByCgpa(students);
    expect(sorted).toHaveLength(1);
    expect(sorted[0].usn).toBe('1GD23CS001');
  });

  it('should handle empty list', () => {
    const sorted = sortByCgpa([]);
    expect(sorted).toHaveLength(0);
  });
});
