
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMembers } from '../../services/dataService';
import { Member } from '../../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const RecentMembersList = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMembers = async () => {
      setIsLoading(true);
      try {
        const data = await getMembers();
        // Sort by newest first and take the first 5
        const sortedMembers = [...data].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ).slice(0, 5);
        setMembers(sortedMembers);
      } catch (error) {
        console.error('Failed to load members:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMembers();
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
        <CardTitle>Recent Members</CardTitle>
        <CardDescription>Newly joined gym members</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-6 h-6 border-4 border-gym-purple border-solid rounded-full border-t-transparent animate-spin"></div>
          </div>
        ) : members.length > 0 ? (
          <div className="space-y-4">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-medium">{member.name}</span>
                  <span className="text-sm text-gray-500">Joined {formatDate(member.createdAt)}</span>
                </div>
                <Link to={`/members/${member.id}`}>
                  <Button variant="ghost" size="sm">View</Button>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500">No recent members to display.</p>
          </div>
        )}
        
        <div className="mt-6">
          <Link to="/members">
            <Button variant="outline" className="w-full">View All Members</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentMembersList;
