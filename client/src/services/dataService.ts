
import { Member, Membership, MembershipAssignment, MemberWithMemberships, MembershipAssignmentWithDetails } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Mock data
let members: Member[] = [
  {
    id: '1',
    name: 'John Doe',
    age: 28,
    email: 'john@example.com',
    contactNumber: '123-456-7890',
    gender: 'male',
    fitnessGoal: 'Weight loss and muscle toning',
    createdAt: new Date(2023, 1, 15).toISOString(),
    updatedAt: new Date(2023, 1, 15).toISOString(),
  },
  {
    id: '2',
    name: 'Jane Smith',
    age: 32,
    email: 'jane@example.com',
    contactNumber: '987-654-3210',
    gender: 'female',
    fitnessGoal: 'Improve overall fitness and flexibility',
    createdAt: new Date(2023, 2, 10).toISOString(),
    updatedAt: new Date(2023, 2, 10).toISOString(),
  },
  {
    id: '3',
    name: 'Michael Johnson',
    age: 45,
    email: 'michael@example.com',
    contactNumber: '555-123-4567',
    gender: 'male',
    fitnessGoal: 'Strength building',
    createdAt: new Date(2023, 3, 5).toISOString(),
    updatedAt: new Date(2023, 3, 5).toISOString(),
  },
  {
    id: '4',
    name: 'Emily Davis',
    age: 24,
    email: 'emily@example.com',
    contactNumber: '444-555-6666',
    gender: 'female',
    fitnessGoal: 'Cardio improvement',
    createdAt: new Date(2023, 4, 20).toISOString(),
    updatedAt: new Date(2023, 4, 20).toISOString(),
  },
  {
    id: '5',
    name: 'David Wilson',
    age: 38,
    email: 'david@example.com',
    contactNumber: '777-888-9999',
    gender: 'male',
    fitnessGoal: 'Weight management and nutrition',
    createdAt: new Date(2023, 5, 12).toISOString(),
    updatedAt: new Date(2023, 5, 12).toISOString(),
  }
];

let memberships: Membership[] = [
  {
    id: '1',
    name: 'Basic',
    description: 'Access to gym facilities during regular hours',
    price: 50,
    durationMonths: 1,
    features: ['Gym access', 'Locker room'],
    discount: 0,
    active: true,
    createdAt: new Date(2023, 0, 1).toISOString(),
    updatedAt: new Date(2023, 0, 1).toISOString(),
  },
  {
    id: '2',
    name: 'Premium',
    description: 'Full access to all facilities and basic classes',
    price: 100,
    durationMonths: 1,
    features: ['Gym access', 'Locker room', 'Group classes', 'Sauna'],
    discount: 0,
    active: true,
    createdAt: new Date(2023, 0, 1).toISOString(),
    updatedAt: new Date(2023, 0, 1).toISOString(),
  },
  {
    id: '3',
    name: 'Elite',
    description: 'Full access including personal training sessions',
    price: 200,
    durationMonths: 1,
    features: ['Gym access', 'Locker room', 'Group classes', 'Sauna', '2 PT sessions/month', 'Nutrition plan'],
    discount: 0,
    active: true,
    createdAt: new Date(2023, 0, 1).toISOString(),
    updatedAt: new Date(2023, 0, 1).toISOString(),
  },
  {
    id: '4',
    name: 'Annual Basic',
    description: 'Basic membership with annual payment',
    price: 540,
    durationMonths: 12,
    features: ['Gym access', 'Locker room'],
    discount: 10,
    active: true,
    createdAt: new Date(2023, 0, 1).toISOString(),
    updatedAt: new Date(2023, 0, 1).toISOString(),
  },
  {
    id: '5',
    name: 'Annual Premium',
    description: 'Premium membership with annual payment',
    price: 1080,
    durationMonths: 12,
    features: ['Gym access', 'Locker room', 'Group classes', 'Sauna'],
    discount: 10,
    active: true,
    createdAt: new Date(2023, 0, 1).toISOString(),
    updatedAt: new Date(2023, 0, 1).toISOString(),
  }
];

let membershipAssignments: MembershipAssignment[] = [
  {
    id: '1',
    memberId: '1',
    membershipId: '2',
    startDate: new Date(2023, 1, 15).toISOString(),
    endDate: new Date(2023, 2, 15).toISOString(),
    status: 'active',
    paymentStatus: 'paid',
    createdAt: new Date(2023, 1, 15).toISOString(),
    updatedAt: new Date(2023, 1, 15).toISOString(),
  },
  {
    id: '2',
    memberId: '2',
    membershipId: '3',
    startDate: new Date(2023, 2, 10).toISOString(),
    endDate: new Date(2023, 3, 10).toISOString(),
    status: 'active',
    paymentStatus: 'paid',
    createdAt: new Date(2023, 2, 10).toISOString(),
    updatedAt: new Date(2023, 2, 10).toISOString(),
  },
  {
    id: '3',
    memberId: '3',
    membershipId: '5',
    startDate: new Date(2023, 3, 5).toISOString(),
    endDate: new Date(2024, 3, 5).toISOString(),
    status: 'active',
    paymentStatus: 'paid',
    createdAt: new Date(2023, 3, 5).toISOString(),
    updatedAt: new Date(2023, 3, 5).toISOString(),
  }
];

// Helper functions to simulate API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Member services
export const getMembers = async (): Promise<Member[]> => {
  await delay(500);
  return [...members];
};

export const getMember = async (id: string): Promise<Member | undefined> => {
  await delay(300);
  return members.find(member => member.id === id);
};

export const createMember = async (memberData: Omit<Member, 'id' | 'createdAt' | 'updatedAt'>): Promise<Member> => {
  await delay(800);
  const newMember: Member = {
    ...memberData,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  members = [...members, newMember];
  return newMember;
};

export const updateMember = async (id: string, memberData: Partial<Omit<Member, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Member | undefined> => {
  await delay(800);
  const index = members.findIndex(member => member.id === id);
  if (index === -1) return undefined;

  const updatedMember = {
    ...members[index],
    ...memberData,
    updatedAt: new Date().toISOString(),
  };
  members = [...members.slice(0, index), updatedMember, ...members.slice(index + 1)];
  return updatedMember;
};

export const deleteMember = async (id: string): Promise<boolean> => {
  await delay(800);
  const initialLength = members.length;
  members = members.filter(member => member.id !== id);
  
  // Also delete any associated memberships
  membershipAssignments = membershipAssignments.filter(assignment => assignment.memberId !== id);
  
  return members.length < initialLength;
};

// Membership services
export const getMemberships = async (): Promise<Membership[]> => {
  await delay(500);
  return [...memberships];
};

export const getMembership = async (id: string): Promise<Membership | undefined> => {
  await delay(300);
  return memberships.find(membership => membership.id === id);
};

export const createMembership = async (membershipData: Omit<Membership, 'id' | 'createdAt' | 'updatedAt'>): Promise<Membership> => {
  await delay(800);
  const newMembership: Membership = {
    ...membershipData,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  memberships = [...memberships, newMembership];
  return newMembership;
};

export const updateMembership = async (id: string, membershipData: Partial<Omit<Membership, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Membership | undefined> => {
  await delay(800);
  const index = memberships.findIndex(membership => membership.id === id);
  if (index === -1) return undefined;

  const updatedMembership = {
    ...memberships[index],
    ...membershipData,
    updatedAt: new Date().toISOString(),
  };
  memberships = [...memberships.slice(0, index), updatedMembership, ...memberships.slice(index + 1)];
  return updatedMembership;
};

export const deleteMembership = async (id: string): Promise<boolean> => {
  await delay(800);
  const initialLength = memberships.length;
  memberships = memberships.filter(membership => membership.id !== id);
  return memberships.length < initialLength;
};

// Membership assignment services
export const getMembershipAssignments = async (): Promise<MembershipAssignment[]> => {
  await delay(500);
  return [...membershipAssignments];
};

export const getMembersWithMemberships = async (): Promise<MemberWithMemberships[]> => {
  await delay(800);
  const allMembers = await getMembers();
  const allMemberships = await getMemberships();
  const allAssignments = await getMembershipAssignments();
  
  return allMembers.map(member => {
    const memberAssignments = allAssignments
      .filter(assignment => assignment.memberId === member.id)
      .map(assignment => {
        const membership = allMemberships.find(m => m.id === assignment.membershipId);
        return {
          ...assignment,
          membership
        } as MembershipAssignmentWithDetails;
      });
      
    return {
      ...member,
      memberships: memberAssignments
    };
  });
};

export const getMembershipAssignment = async (id: string): Promise<MembershipAssignmentWithDetails | undefined> => {
  await delay(300);
  const assignment = membershipAssignments.find(a => a.id === id);
  if (!assignment) return undefined;
  
  const member = await getMember(assignment.memberId);
  const membership = await getMembership(assignment.membershipId);
  
  return {
    ...assignment,
    member,
    membership
  };
};

export const createMembershipAssignment = async (assignmentData: Omit<MembershipAssignment, 'id' | 'createdAt' | 'updatedAt'>): Promise<MembershipAssignment> => {
  await delay(800);
  const newAssignment: MembershipAssignment = {
    ...assignmentData,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  membershipAssignments = [...membershipAssignments, newAssignment];
  return newAssignment;
};

export const updateMembershipAssignment = async (id: string, assignmentData: Partial<Omit<MembershipAssignment, 'id' | 'createdAt' | 'updatedAt'>>): Promise<MembershipAssignment | undefined> => {
  await delay(800);
  const index = membershipAssignments.findIndex(assignment => assignment.id === id);
  if (index === -1) return undefined;

  const updatedAssignment = {
    ...membershipAssignments[index],
    ...assignmentData,
    updatedAt: new Date().toISOString(),
  };
  membershipAssignments = [...membershipAssignments.slice(0, index), updatedAssignment, ...membershipAssignments.slice(index + 1)];
  return updatedAssignment;
};

export const deleteMembershipAssignment = async (id: string): Promise<boolean> => {
  await delay(800);
  const initialLength = membershipAssignments.length;
  membershipAssignments = membershipAssignments.filter(assignment => assignment.id !== id);
  return membershipAssignments.length < initialLength;
};

// Analytics
export const getDashboardStats = async (): Promise<{
  totalMembers: number;
  activeMemberships: number;
  expiredMemberships: number;
  totalRevenue: number;
}> => {
  await delay(700);
  
  const activeAssignments = membershipAssignments.filter(a => a.status === 'active');
  const expiredAssignments = membershipAssignments.filter(a => a.status === 'expired');
  
  // Calculate total revenue from all paid memberships
  const totalRevenue = membershipAssignments
    .filter(a => a.paymentStatus === 'paid')
    .reduce((total, assignment) => {
      const membership = memberships.find(m => m.id === assignment.membershipId);
      return total + (membership?.price || 0);
    }, 0);
  
  return {
    totalMembers: members.length,
    activeMemberships: activeAssignments.length,
    expiredMemberships: expiredAssignments.length,
    totalRevenue
  };
};
