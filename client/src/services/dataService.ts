import { Member, Membership, MembershipAssignment, MemberWithMemberships, MembershipAssignmentWithDetails } from '../types';

const API_URL = import.meta.env.VITE_API_URL;

// Member services
export const getMembers = async (): Promise<Member[]> => {
  const response = await fetch(`${API_URL}/members`);
  if (!response.ok) {
    throw new Error('Failed to fetch members');
  }
  const data = await response.json();
  // Ensure each member has an id
  return data.map((member: Member) => ({
    ...member,
    id: member.id  // Fallback to _id or generate new id if neither exists
  }));
};

export const getMember = async (id: string): Promise<Member | undefined> => {
  const response = await fetch(`${API_URL}/members/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch member');
  }
  return response.json();
};

export const createMember = async (memberData: Omit<Member, 'createdAt' | 'updatedAt'>): Promise<Member> => {
  // Ensure memberData has an id
  if (!memberData.id) {
    throw new Error('Member ID is required');
  }

  const response = await fetch(`${API_URL}/members`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...memberData,
      // Ensure all required fields are present
      id: memberData.id,
      name: memberData.name,
      email: memberData.email,
      age: Number(memberData.age),
      gender: memberData.gender,
      contactNumber: memberData.contactNumber || '',
      fitnessGoal: memberData.fitnessGoal || ''
    }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    console.error('Server response:', data);
    throw new Error(data.message || 'Failed to create member');
  }
  
  return data;
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
  try {
    console.log('Attempting to delete member with ID:', id);
    const response = await fetch(`${API_URL}/members/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete member');
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }

    const data = await response.json();
    console.log('Delete response:', data);
    return true;
  } catch (error) {
    console.error('Delete member error:', error);
    throw error;
  }
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
  console.log('Fetching membership with ID:', id);
  const response = await fetch(`${API_URL}/memberships/${id}`);
  if (!response.ok) {
    if (response.status === 404) {
      return undefined;
    }
    throw new Error('Failed to fetch membership');
  }
  return response.json();
};

export const createMembership = async (membershipData: Omit<Membership, 'createdAt' | 'updatedAt'>): Promise<Membership> => {
  // Ensure membershipData has an id
  if (!membershipData.id) {
    throw new Error('Membership ID is required');
  }

  const response = await fetch(`${API_URL}/memberships`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...membershipData,
      // Ensure all required fields are present
      id: membershipData.id,
      name: membershipData.name,
      description: membershipData.description,
      price: Number(membershipData.price),
      durationMonths: Number(membershipData.durationMonths),
      features: membershipData.features || [],
      discount: Number(membershipData.discount) || 0,
      active: membershipData.active
    }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    console.error('Server response:', data);
    throw new Error(data.message || 'Failed to create membership');
  }
  
  return data;
};

export const updateMembership = async (
  id: string, 
  data: Partial<Omit<Membership, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<Membership> => {
  const response = await fetch(`${API_URL}/memberships/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...data,
      features: data.features || [], // Ensure features are always included
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update membership');
  }

  return response.json();
};

export const deleteMembership = async (id: string): Promise<boolean> => {
  try {
    console.log('Attempting to delete membership:', id);
    const response = await fetch(`${API_URL}/memberships/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete membership');
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }

    const data = await response.json();
    console.log('Delete response:', data);
    return true;
  } catch (error) {
    console.error('Delete membership error:', error);
    throw error;
  }
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
