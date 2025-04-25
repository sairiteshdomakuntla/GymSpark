
import axios from 'axios';
import { Member, Membership, MembershipAssignment } from '../types';

// This would be your Express server URL
const API_BASE_URL = 'http://localhost:5000/api';

// Configure axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authentication token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('gymspark_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Authentication services
export const loginService = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  if (response.data.token) {
    localStorage.setItem('gymspark_token', response.data.token);
    localStorage.setItem('gymspark_admin', JSON.stringify(response.data.admin));
  }
  return response.data;
};

export const logoutService = () => {
  localStorage.removeItem('gymspark_token');
  localStorage.removeItem('gymspark_admin');
};

// Member services
export const getMembersService = async () => {
  const response = await api.get('/members');
  return response.data;
};

export const getMemberService = async (id: string) => {
  const response = await api.get(`/members/${id}`);
  return response.data;
};

export const createMemberService = async (memberData: Omit<Member, 'id' | 'createdAt' | 'updatedAt'>) => {
  const response = await api.post('/members', memberData);
  return response.data;
};

export const updateMemberService = async (
  id: string,
  memberData: Partial<Omit<Member, 'id' | 'createdAt' | 'updatedAt'>>
) => {
  const response = await api.put(`/members/${id}`, memberData);
  return response.data;
};

export const deleteMemberService = async (id: string) => {
  const response = await api.delete(`/members/${id}`);
  return response.data;
};

// Membership services
export const getMembershipsService = async () => {
  const response = await api.get('/memberships');
  return response.data;
};

export const getMembershipService = async (id: string) => {
  const response = await api.get(`/memberships/${id}`);
  return response.data;
};

export const createMembershipService = async (
  membershipData: Omit<Membership, 'id' | 'createdAt' | 'updatedAt'>
) => {
  const response = await api.post('/memberships', membershipData);
  return response.data;
};

export const updateMembershipService = async (
  id: string,
  membershipData: Partial<Omit<Membership, 'id' | 'createdAt' | 'updatedAt'>>
) => {
  const response = await api.put(`/memberships/${id}`, membershipData);
  return response.data;
};

export const deleteMembershipService = async (id: string) => {
  const response = await api.delete(`/memberships/${id}`);
  return response.data;
};

// Membership assignment services
export const getMembershipAssignmentsService = async () => {
  const response = await api.get('/membership-assignments');
  return response.data;
};

export const getMembersWithMembershipsService = async () => {
  const response = await api.get('/members/with-memberships');
  return response.data;
};

export const getMembershipAssignmentService = async (id: string) => {
  const response = await api.get(`/membership-assignments/${id}`);
  return response.data;
};

export const createMembershipAssignmentService = async (
  assignmentData: Omit<MembershipAssignment, 'id' | 'createdAt' | 'updatedAt'>
) => {
  const response = await api.post('/membership-assignments', assignmentData);
  return response.data;
};

export const updateMembershipAssignmentService = async (
  id: string,
  assignmentData: Partial<Omit<MembershipAssignment, 'id' | 'createdAt' | 'updatedAt'>>
) => {
  const response = await api.put(`/membership-assignments/${id}`, assignmentData);
  return response.data;
};

export const deleteMembershipAssignmentService = async (id: string) => {
  const response = await api.delete(`/membership-assignments/${id}`);
  return response.data;
};

// Dashboard analytics
export const getDashboardStatsService = async () => {
  const response = await api.get('/dashboard/stats');
  return response.data;
};
