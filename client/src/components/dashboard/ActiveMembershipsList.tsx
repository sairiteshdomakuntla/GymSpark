import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMembershipAssignments } from '../../services/dataService';
import { MembershipAssignmentWithDetails } from '../../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const ActiveMembershipsList = () => {
  const [memberships, setMemberships] = useState<MembershipAssignmentWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMemberships = async () => {
      setIsLoading(true);
      try {
        const assignments = await getMembershipAssignments();
        console.log('Raw assignments:', assignments);
        
        // Filter only active assignments with valid data
        const validAssignments = assignments.filter(
          a => a.member && 
               a.membership && 
               a.status === 'active' &&
               new Date(a.endDate) >= new Date() // Only future or current end dates
        );
        
        console.log('Valid assignments:', validAssignments);

        // Sort by start date and take latest 5
        const sortedAssignments = validAssignments
          .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
          .slice(0, 5);

        setMemberships(sortedAssignments);
      } catch (error) {
        console.error('Failed to load memberships:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMemberships();

    // Refresh when new membership is assigned
    window.addEventListener('membershipAssigned', loadMemberships);
    return () => window.removeEventListener('membershipAssigned', loadMemberships);
  }, []);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Active Memberships</CardTitle>
        <CardDescription>Currently active membership plans</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-6 h-6 border-4 border-gym-purple border-solid rounded-full border-t-transparent animate-spin"></div>
          </div>
        ) : memberships.length > 0 ? (
          <div className="space-y-4">
            {memberships.map((assignment) => (
              <div key={assignment.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex flex-col">
                  <span className="font-medium">{assignment.member?.name}</span>
                  <div className="flex items-center mt-1">
                    <Badge className="bg-green-100 text-green-800 mr-2">
                      {assignment.membership?.name}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      Until: {formatDate(assignment.endDate)}
                    </span>
                  </div>
                </div>
                <Link to={`/members/${assignment.memberId}`}>
                  <Button variant="outline" size="sm">View</Button>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500">No active memberships found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActiveMembershipsList;
