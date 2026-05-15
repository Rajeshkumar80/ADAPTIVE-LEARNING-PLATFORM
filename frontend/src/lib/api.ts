/**
 * API Client for Backend Communication
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class APIClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Load token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
      throw new Error(error.detail || 'Request failed');
    }

    return response.json();
  }

  // ============= Auth APIs =============
  async register(data: { email: string; username: string; password: string; full_name?: string }) {
    const response = await this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setToken(response.access_token);
    return response;
  }

  async login(username: string, password: string) {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    const response = await fetch(`${this.baseURL}/api/auth/login`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Login failed' }));
      throw new Error(error.detail || 'Login failed');
    }

    const data = await response.json();
    this.setToken(data.access_token);
    return data;
  }

  async logout() {
    await this.request('/api/auth/logout', { method: 'POST' });
    this.clearToken();
  }

  async getMe() {
    return this.request('/api/auth/me');
  }

  // ============= Student APIs =============
  async getStudentProfile() {
    return this.request('/api/student/profile');
  }

  async updateStudentProfile(data: any) {
    return this.request('/api/student/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getDashboard() {
    return this.request('/api/student/dashboard');
  }

  async getProgress() {
    return this.request('/api/student/progress');
  }

  // ============= Journal APIs =============
  async getJournalEntries() {
    return this.request('/api/journal/entries');
  }

  async createJournalEntry(data: any) {
    return this.request('/api/journal/entries', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getJournalEntry(id: number) {
    return this.request(`/api/journal/entries/${id}`);
  }

  async updateJournalEntry(id: number, data: any) {
    return this.request(`/api/journal/entries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteJournalEntry(id: number) {
    return this.request(`/api/journal/entries/${id}`, {
      method: 'DELETE',
    });
  }

  // ============= Test APIs =============
  async getTests() {
    return this.request('/api/tests');
  }

  async getTest(id: number) {
    return this.request(`/api/tests/${id}`);
  }

  async startTest(testId: number) {
    return this.request('/api/tests/start', {
      method: 'POST',
      body: JSON.stringify({ test_id: testId }),
    });
  }

  async submitTest(attemptId: number, answers: any) {
    return this.request(`/api/tests/submit/${attemptId}`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    });
  }

  async getTestResults(attemptId: number) {
    return this.request(`/api/tests/results/${attemptId}`);
  }

  // ============= AI Assistant APIs =============
  async askAI(query: string, context?: string) {
    return this.request('/api/ai/ask', {
      method: 'POST',
      body: JSON.stringify({ query, context }),
    });
  }

  async getAITutor(topic: string) {
    return this.request('/api/ai/tutor', {
      method: 'POST',
      body: JSON.stringify({ topic }),
    });
  }

  // ============= Study Planner APIs =============
  async getStudyPlan() {
    return this.request('/api/planner/plan');
  }

  async createStudyPlan(data: any) {
    return this.request('/api/planner/plan', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getStudySessions() {
    return this.request('/api/planner/sessions');
  }

  async startStudySession(data: any) {
    return this.request('/api/planner/sessions/start', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async endStudySession(sessionId: number, data: any) {
    return this.request(`/api/planner/sessions/${sessionId}/end`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ============= Notification APIs =============
  async getNotifications() {
    return this.request('/api/notifications');
  }

  async markNotificationRead(id: number) {
    return this.request(`/api/notifications/${id}/read`, {
      method: 'PUT',
    });
  }

  async markAllNotificationsRead() {
    return this.request('/api/notifications/read-all', {
      method: 'PUT',
    });
  }

  // ============= Admin APIs =============
  async getSubjects() {
    return this.request('/api/admin/subjects');
  }

  async createSubject(data: any) {
    return this.request('/api/admin/subjects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getStudents() {
    return this.request('/api/admin/students');
  }

  async createTest(data: any) {
    return this.request('/api/admin/tests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const api = new APIClient(API_URL);
export default api;
