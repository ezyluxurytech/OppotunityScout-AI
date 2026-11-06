import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api/v1';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = Cookies.get('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as any;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refreshToken = Cookies.get('refreshToken');

      if (refreshToken) {
        try {
          const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
          Cookies.set('accessToken', data.accessToken, { expires: 1 / 96 }); // 15 min
          Cookies.set('refreshToken', data.refreshToken, { expires: 7 });
          original.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(original);
        } catch {
          clearAuthCookies();
          window.location.href = '/login';
        }
      } else {
        clearAuthCookies();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  },
);

export function setAuthCookies(accessToken: string, refreshToken: string) {
  Cookies.set('accessToken', accessToken, { expires: 1 / 96, secure: process.env.NODE_ENV === 'production' });
  Cookies.set('refreshToken', refreshToken, { expires: 7, secure: process.env.NODE_ENV === 'production' });
}

export function clearAuthCookies() {
  Cookies.remove('accessToken');
  Cookies.remove('refreshToken');
  Cookies.remove('user');
}

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authApi = {
  register: (data: { name: string; email: string; password: string; role: string }) =>
    api.post('/auth/register', data).then((r) => r.data),

  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data).then((r) => r.data),

  logout: () => api.post('/auth/logout').then((r) => r.data),

  getMe: () => api.get('/users/me').then((r) => r.data),
};

// ─── Profiles ────────────────────────────────────────────────────────────────
export const profilesApi = {
  getMyProfile: () => api.get('/profiles/me').then((r) => r.data),
  upsertOwnerProfile: (data: any) => api.put('/profiles/me/owner', data).then((r) => r.data),
  upsertInvestorProfile: (data: any) => api.put('/profiles/me/investor', data).then((r) => r.data),
};

// ─── Opportunities ────────────────────────────────────────────────────────────
export const opportunitiesApi = {
  create: (data: any) => api.post('/opportunities', data).then((r) => r.data),
  getMyOpportunities: () => api.get('/opportunities/me').then((r) => r.data),
  getOne: (id: string) => api.get(`/opportunities/${id}`).then((r) => r.data),
  update: (id: string, data: any) => api.patch(`/opportunities/${id}`, data).then((r) => r.data),
  submit: (id: string) => api.post(`/opportunities/${id}/submit`).then((r) => r.data),
  discover: (params?: any) => api.get('/opportunities', { params }).then((r) => r.data),
  requestAnalysis: (id: string) => api.post(`/opportunities/${id}/analyze`).then((r) => r.data),
  getAnalysis: (id: string) => api.get(`/opportunities/${id}/analysis`).then((r) => r.data),
  getProgress: (id: string) => api.get(`/opportunities/${id}/progress`).then((r) => r.data),
};

// ─── Investor ────────────────────────────────────────────────────────────────
export const investorApi = {
  getPreferences: () => api.get('/investor/preferences/me').then((r) => r.data),
  upsertPreferences: (data: any) => api.put('/investor/preferences/me', data).then((r) => r.data),
  getMatches: () => api.get('/matches').then((r) => r.data),
  getSaved: () => api.get('/saved-opportunities').then((r) => r.data),
  saveOpportunity: (id: string) => api.post(`/opportunities/${id}/save`).then((r) => r.data),
  unsaveOpportunity: (id: string) => api.delete(`/opportunities/${id}/save`).then((r) => r.data),
};

// ─── Connection Requests ──────────────────────────────────────────────────────
export const connectionApi = {
  create: (data: { opportunityId: string; message?: string }) =>
    api.post('/connection-requests', data).then((r) => r.data),
  list: () => api.get('/connection-requests').then((r) => r.data),
  update: (id: string, action: string) =>
    api.patch(`/connection-requests/${id}`, { action }).then((r) => r.data),
};

// ─── Progress ─────────────────────────────────────────────────────────────────
export const progressApi = {
  create: (data: any) => api.post('/progress', data).then((r) => r.data),
};

// ─── Admin ────────────────────────────────────────────────────────────────────
export const adminApi = {
  getReviewQueue: (params?: any) => api.get('/admin/opportunities', { params }).then((r) => r.data),
  reviewOpportunity: (id: string, data: any) =>
    api.patch(`/admin/opportunities/${id}/review`, data).then((r) => r.data),
  listUsers: (params?: any) => api.get('/admin/users', { params }).then((r) => r.data),
  manageUser: (id: string, data: any) => api.patch(`/admin/users/${id}`, data).then((r) => r.data),
  getMetrics: () => api.get('/admin/metrics').then((r) => r.data),
  getAuditLogs: (params?: any) => api.get('/admin/audit-logs', { params }).then((r) => r.data),
};
