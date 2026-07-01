/**
 * API Client — communicates with FastAPI backend
 * Falls back to localStorage mock if backend is unavailable
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class APIClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('adaptlearn_token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('adaptlearn_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adaptlearn_token');
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, { ...options, headers });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Request failed' }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // ============= Auth =============
  async register(data: {
    email: string;
    username: string;
    password: string;
    full_name?: string;
    role: 'student' | 'admin';
    usn?: string;
    employee_id?: string;
  }) {
    const response = await this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setToken(response.access_token);
    return response;
  }

  async login(username: string, password: string) {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const response = await fetch(`${this.baseURL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ detail: 'Login failed' }));
      throw new Error(err.detail || 'Login failed');
    }

    const data = await response.json();
    this.setToken(data.access_token);
    return data;
  }

  async logout() {
    try {
      await this.request('/api/auth/logout', { method: 'POST' });
    } catch {}
    this.clearToken();
  }

  async getMe() {
    return this.request('/api/auth/me');
  }

  // ============= Student =============
  async getStudentDashboard() {
    return this.request('/api/student/dashboard');
  }

  async getStudentSubjects() {
    return this.request('/api/student/subjects');
  }

  async getStudentCertificates() {
    return this.request('/api/student/certificates');
  }

  async getStudentAchievements() {
    return this.request('/api/student/achievements');
  }

  async getStudentProgress() {
    return this.request('/api/student/progress');
  }

  // ============= Admin =============
  async getAdminDashboard() {
    return this.request('/api/admin/dashboard');
  }

  async getAdminStudents(filters?: { section?: string; semester?: number }) {
    const params = new URLSearchParams();
    if (filters?.section) params.append('section', filters.section);
    if (filters?.semester) params.append('semester', String(filters.semester));
    const qs = params.toString();
    return this.request(`/api/admin/students${qs ? `?${qs}` : ''}`);
  }

  async getAdminSubjects() {
    return this.request('/api/admin/subjects');
  }

  async getAntiCheatFlags() {
    return this.request('/api/admin/anti-cheat-flags');
  }

  async getClassAnalytics() {
    return this.request('/api/admin/analytics');
  }

  async createStudent(studentData: any) {
    return this.request('/api/admin/students', {
      method: 'POST',
      body: JSON.stringify(studentData),
    });
  }

  async updateStudent(usn: string, studentData: any) {
    return this.request(`/api/admin/students/${usn}`, {
      method: 'PUT',
      body: JSON.stringify(studentData),
    });
  }

  async deleteStudent(usn: string) {
    return this.request(`/api/admin/students/${usn}`, {
      method: 'DELETE',
    });
  }

  async importStudents(students: any[]) {
    return this.request('/api/admin/students/import', {
      method: 'POST',
      body: JSON.stringify(students),
    });
  }

  // ============= Tests =============
  async listTests() {
    return this.request('/api/tests/');
  }

  async getTest(id: number) {
    return this.request(`/api/tests/${id}`);
  }

  async createTest(data: any) {
    return this.request('/api/tests/', { method: 'POST', body: JSON.stringify(data) });
  }

  async startTest(testId: number) {
    return this.request(`/api/tests/${testId}/start`, { method: 'POST' });
  }

  async submitTest(attemptId: number, answers: Record<string, string>, antiCheatFlags?: any) {
    return this.request(`/api/tests/${attemptId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers, anti_cheat_flags: antiCheatFlags }),
    });
  }

  async reportViolation(attemptId: number, severity: string, violation: string) {
    return this.request(`/api/tests/${attemptId}/violation`, {
      method: 'POST',
      body: JSON.stringify({ severity, violation }),
    });
  }

  async getMyAttempts() {
    return this.request('/api/tests/my-attempts');
  }

  async getUpcomingTests() {
    return this.request('/api/tests/upcoming');
  }

  // ============= Journal =============
  async listJournalEntries(filters?: { q?: string; starred?: boolean }) {
    const params = new URLSearchParams();
    if (filters?.q) params.append('q', filters.q);
    if (filters?.starred !== undefined) params.append('starred', String(filters.starred));
    const qs = params.toString();
    return this.request(`/api/journal/${qs ? `?${qs}` : ''}`);
  }

  async createJournalEntry(data: any) {
    return this.request('/api/journal/', { method: 'POST', body: JSON.stringify(data) });
  }

  async getJournalEntry(id: number) {
    return this.request(`/api/journal/${id}`);
  }

  async updateJournalEntry(id: number, data: any) {
    return this.request(`/api/journal/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deleteJournalEntry(id: number) {
    return this.request(`/api/journal/${id}`, { method: 'DELETE' });
  }

  async getJournalStats() {
    return this.request('/api/journal/stats/summary');
  }

  // ============= AI =============
  async askAI(query: string, context?: string) {
    return this.request('/api/ai/ask', {
      method: 'POST',
      body: JSON.stringify({ query, context }),
    });
  }

  // ============= Planner =============
  async getTodayPlan() {
    return this.request('/api/planner/today');
  }

  async getGoals() {
    return this.request('/api/planner/goals');
  }

  async getMastery() {
    return this.request('/api/planner/mastery');
  }

  // ============= Learning =============
  async getDueToday() {
    return this.request('/api/learning/due-today');
  }

  async updateLearningState(topicId: number, scorePercent: number) {
    return this.request('/api/learning/update', {
      method: 'POST',
      body: JSON.stringify({ topic_id: topicId, score_percent: scorePercent }),
    });
  }

  async getLearningDashboard() {
    return this.request('/api/learning/dashboard');
  }

  // ============= Notifications =============
  async getNotifications() {
    return this.request('/api/notifications/');
  }

  async markNotificationRead(id: number) {
    return this.request(`/api/notifications/${id}/read`, { method: 'PUT' });
  }

  async markAllRead() {
    return this.request('/api/notifications/read-all', { method: 'PUT' });
  }

  async sendNotification(data: { title: string; message: string; type: string; target_users?: number[]; target_section?: string }) {
    return this.request('/api/notifications/send', { method: 'POST', body: JSON.stringify(data) });
  }

  async getNotificationStats() {
    return this.request('/api/notifications/stats');
  }

  async getLeaderboard() {
    return this.request('/api/student/leaderboard');
  }

  // ============= Documents (Phase 2B) =============
  async uploadDocument(file: File, subject?: string, description?: string) {
    const formData = new FormData();
    formData.append('file', file);
    if (subject) formData.append('subject', subject);
    if (description) formData.append('description', description);

    const headers: Record<string, string> = {};
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`;

    const response = await fetch(`${this.baseURL}/api/documents/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Upload failed' }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }
    return response.json();
  }

  async listDocuments() {
    return this.request('/api/documents/');
  }

  async deleteDocument(docId: string) {
    return this.request(`/api/documents/${docId}`, { method: 'DELETE' });
  }

  async askDocument(docId: string, question: string) {
    const formData = new URLSearchParams();
    formData.append('doc_id', docId);
    formData.append('question', question);

    const headers: Record<string, string> = { 'Content-Type': 'application/x-www-form-urlencoded' };
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`;

    const response = await fetch(`${this.baseURL}/api/documents/ask`, {
      method: 'POST',
      headers,
      body: formData.toString(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Query failed' }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }
    return response.json();
  }

  // ============= VTU (Phase 2D) =============
  async getVTUSubjects(semester?: number) {
    const qs = semester ? `?semester=${semester}` : '';
    return this.request(`/api/vtu/subjects${qs}`);
  }

  async getVTUSubjectDetails(code: string) {
    return this.request(`/api/vtu/subjects/${code}`);
  }

  async getVTUProgramOutcomes() {
    return this.request('/api/vtu/program-outcomes');
  }

  // ============= Student Profile (Phase 2C) =============
  async getStudentProfile() {
    return this.request('/api/student/profile');
  }

  async updateStudentProfile(data: { semester?: number; section?: string; branch?: string; full_name?: string }) {
    const params = new URLSearchParams();
    if (data.semester) params.append('semester', String(data.semester));
    if (data.section) params.append('section', data.section);
    if (data.branch) params.append('branch', data.branch);
    if (data.full_name) params.append('full_name', data.full_name);
    return this.request(`/api/student/profile?${params.toString()}`, { method: 'PUT' });
  }
}

export const api = new APIClient(API_URL);
export default api;
