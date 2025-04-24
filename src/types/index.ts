
export interface Member {
  id: string;
  name: string;
  age: number;
  email: string;
  contactNumber: string;
  gender: 'male' | 'female' | 'other';
  fitnessGoal: string;
  createdAt: string;
  updatedAt: string;
}

export interface Membership {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMonths: number;
  features: string[];
  discount: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MembershipAssignment {
  id: string;
  memberId: string;
  membershipId: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'cancelled';
  paymentStatus: 'paid' | 'pending' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export interface MembershipAssignmentWithDetails extends MembershipAssignment {
  member?: Member;
  membership?: Membership;
}

export interface MemberWithMemberships extends Member {
  memberships?: MembershipAssignmentWithDetails[];
}

export type SortDirection = 'asc' | 'desc';

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
}
