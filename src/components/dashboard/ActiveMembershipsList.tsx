
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMembershipAssignments, getMembers, getMemberships } from '../../services/dataService';
import { Member, Membership, MembershipAssignment } from '../../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface MembershipWithDetails extends MembershipAssignment {
  memberName: string;
  planName: string;
}

const ActiveMembershipsList = () => {
  const [memberships, setMemberships] = useState<MembershipWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMemberships = async () => {
      setIsLoading(true);
      try {
        const [assignments, members, plans] = await Promise.all([
          getMembershipAssignments(),
          getMembers(),
          getMemberships(),
        ]);
        
        // Get active memberships and enrich with member and plan details
        const activeMemberships = assignments
          .filter(a => a.status === 'active')
          .map(assignment => {
            const member = members.find(m => m.id === assignment.memberId);
            const plan = plans.find(p => p.id === assignment.membershipId);
            
            return {
              ...assignment,
              memberName: member?.name || 'Unknown',
              planName: plan?.name || 'Unknown',
            };
          })
          .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
          .slice(0, 5);
        
        setMemberships(activeMemberships);
      } catch (error) {
        console.error('Failed to load memberships:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMemberships();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Active Memberships</CardTitle>
        <CardDescription>Current active membership plans</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-6 h-6 border-4 border-gym-purple border-solid rounded-full border-t-transparent animate-spin"></div>
          </div>
        ) : memberships.length > 0 ? (
          <div className="space-y-4">
            {memberships.map((membership) => (
              <div key={membership.id} className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-medium">{membership.memberName}</span>
                  <div className="flex items-center mt-1">
                    <Badge variant="outline" className="bg-green-100 text-green-800 mr-2">
                      {membership.planName}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      Expires: {formatDate(membership.endDate)}
                    </span>
                  </div>
                </div>
                <Link to={`/members/${membership.memberId}`}>
                  <Button variant="ghost" size="sm">View</Button>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500">No active memberships to display.</p>
          </div>
        )}
        
        <div className="mt-6">
          <Link to="/memberships">
            <Button variant="outline" className="w-full">View All Memberships</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActiveMembershipsList;
