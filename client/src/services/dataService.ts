import { Member, Membership, MembershipAssignment, MemberWithMemberships, MembershipAssignmentWithDetails } from '../types';

const API_URL = import.meta.env.VITE_API_URL;

// Member services
export const getMembers = async (): Promise<Member[]> => {
  const response = await fetch(`${API_URL}/members`);
  if (!response.ok) {
    throw new Error('Failed to fetch members');
  }
  return response.json();
};

export const getMember = async (id: string): Promise<Member | undefined> => {
  const response = await fetch(`${API_URL}/members/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch member');
  }
  return response.json();
};

export const createMember = async (memberData: Omit<Member, 'id' | 'createdAt' | 'updatedAt'>): Promise<Member> => {
  const response = await fetch(`${API_URL}/members`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(memberData),
  });
  if (!response.ok) {
    throw new Error('Failed to create member');
  }
  return response.json();
};

export const updateMember = async (id: string, memberData: Partial<Omit<Member, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Member | undefined> => {
  const response = await fetch(`${API_URL}/members/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(memberData),
  });
  if (!response.ok) {
    throw new Error('Failed to update member');
  }
  return response.json();
};

export const deleteMember = async (id: string): Promise<boolean> => {
  const response = await fetch(`${API_URL}/members/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete member');
  }
  return true;
};

// Membership services
export const getMemberships = async (): Promise<Membership[]> => {
  const response = await fetch(`${API_URL}/memberships`);
  if (!response.ok) {
    throw new Error('Failed to fetch memberships');
  }
  return response.json();
};

export const getMembership = async (id: string): Promise<Membership | undefined> => {
  const response = await fetch(`${API_URL}/memberships/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch membership');
  }
  return response.json();
};

export const createMembership = async (membershipData: Omit<Membership, 'id' | 'createdAt' | 'updatedAt'>): Promise<Membership> => {
  const response = await fetch(`${API_URL}/memberships`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(membershipData),
  });
  if (!response.ok) {
    throw new Error('Failed to create membership');
  }
  return response.json();
};

export const updateMembership = async (id: string, membershipData: Partial<Omit<Membership, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Membership | undefined> => {
  const response = await fetch(`${API_URL}/memberships/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(membershipData),
  });
  if (!response.ok) {
    throw new Error('Failed to update membership');
  }
  return response.json();
};

export const deleteMembership = async (id: string): Promise<boolean> => {
  const response = await fetch(`${API_URL}/memberships/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete membership');
  }
  return true;
};

// Membership assignment services
export const getMembershipAssignments = async (): Promise<MembershipAssignment[]> => {
  const response = await fetch(`${API_URL}/membership-assignments`);
  if (!response.ok) {
    throw new Error('Failed to fetch membership assignments');
  }
  return response.json();
};

export const getMembershipAssignment = async (id: string): Promise<MembershipAssignmentWithDetails | undefined> => {
  const response = await fetch(`${API_URL}/membership-assignments/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch membership assignment');
  }
  return response.json();
};

export const createMembershipAssignment = async (assignmentData: Omit<MembershipAssignment, 'id' | 'createdAt' | 'updatedAt'>): Promise<MembershipAssignment> => {
  const response = await fetch(`${API_URL}/membership-assignments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(assignmentData),
  });
  if (!response.ok) {
    throw new Error('Failed to create membership assignment');
  }
  return response.json();
};

export const updateMembershipAssignment = async (id: string, assignmentData: Partial<Omit<MembershipAssignment, 'id' | 'createdAt' | 'updatedAt'>>): Promise<MembershipAssignment | undefined> => {
  const response = await fetch(`${API_URL}/membership-assignments/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(assignmentData),
  });
  if (!response.ok) {
    throw new Error('Failed to update membership assignment');
  }
  return response.json();
};

export const deleteMembershipAssignment = async (id: string): Promise<boolean> => {
  const response = await fetch(`${API_URL}/membership-assignments/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete membership assignment');
  }
  return true;
};

// Dashboard services
export const getDashboardStats = async () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const response = await fetch(`${API_URL}/dashboard/stats`);
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard stats');
  }
  return response.json();
};
