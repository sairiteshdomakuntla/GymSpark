
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getMember, getMembershipAssignments, getMemberships } from '../../services/dataService';
import { Member, Membership, MembershipAssignment } from '../../types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit, Plus, Calendar, User, Mail, Phone, Flag, Activity } from 'lucide-react';
import AssignMembershipDialog from '../memberships/AssignMembershipDialog';
import { toast } from 'sonner';

const MemberDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [member, setMember] = useState<Member | null>(null);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [membershipAssignments, setMembershipAssignments] = useState<MembershipAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      if (!id) return;
      
      const memberData = await getMember(id);
      if (!memberData) {
        toast.error('Member not found');
        navigate('/members');
        return;
      }
      
      setMember(memberData);
      
      const [allMemberships, allAssignments] = await Promise.all([
        getMemberships(),
        getMembershipAssignments()
      ]);
      
      setMemberships(allMemberships);
      
      // Filter assignments for this member
      const memberAssignments = allAssignments.filter(
        assignment => assignment.memberId === id
      );
      setMembershipAssignments(memberAssignments);
      
    } catch (error) {
      console.error('Error loading member details:', error);
      toast.error('Failed to load member details');
    } finally {
      setIsLoading(false);
    }
  };

  const getMembershipDetails = (membershipId: string) => {
    return memberships.find(m => m.id === membershipId);
  };

  const getMembershipStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-gym-purple border-solid rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Member not found.</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => navigate('/members')}
        >
          Back to Members
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigate('/members')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{member.name}</h1>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline"
            onClick={() => navigate(`/members/edit/${member.id}`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Member
          </Button>
          
          <Button 
            className="bg-gym-purple hover:bg-gym-dark-purple"
            onClick={() => setIsAssignDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Assign Membership
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Member Information</CardTitle>
            <CardDescription>Personal details and contact info</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <User className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium">Personal Info</p>
                <p className="text-sm text-gray-500">
                  {member.age} years old, {member.gender.charAt(0).toUpperCase() + member.gender.slice(1)}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Mail className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-gray-500">{member.email}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Phone className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium">Phone</p>
                <p className="text-sm text-gray-500">{member.contactNumber}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Flag className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium">Fitness Goal</p>
                <p className="text-sm text-gray-500">{member.fitnessGoal}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium">Member Since</p>
                <p className="text-sm text-gray-500">{formatDate(member.createdAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Membership History</CardTitle>
              <CardDescription>Current and past memberships</CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsAssignDialogOpen(true)}
            >
              <Plus className="mr-2 h-3 w-3" />
              Assign New
            </Button>
          </CardHeader>
          <CardContent>
            {membershipAssignments.length > 0 ? (
              <div className="space-y-4">
                {membershipAssignments.map((assignment) => {
                  const membershipDetails = getMembershipDetails(assignment.membershipId);
                  return (
                    <div key={assignment.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-lg">
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                          <Activity className="h-4 w-4 text-gym-purple" />
                          <h3 className="font-medium">{membershipDetails?.name || 'Unknown Membership'}</h3>
                          <Badge variant="outline" className={getMembershipStatusColor(assignment.status)}>
                            {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">
                          {formatDate(assignment.startDate)} - {formatDate(assignment.endDate)}
                        </p>
                        <p className="text-sm">
                          <Badge variant={assignment.paymentStatus === 'paid' ? 'default' : 'destructive'} className="mr-2">
                            {assignment.paymentStatus.charAt(0).toUpperCase() + assignment.paymentStatus.slice(1)}
                          </Badge>
                          {membershipDetails ? `$${membershipDetails.price}` : ''}
                        </p>
                      </div>
                      <div className="mt-3 sm:mt-0">
                        <Link to={`/memberships/${membershipDetails?.id}`}>
                          <Button variant="outline" size="sm">View Details</Button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center p-6 border rounded-lg">
                <p className="text-gray-500">No memberships assigned yet.</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => setIsAssignDialogOpen(true)}
                >
                  <Plus className="mr-2 h-3 w-3" />
                  Assign Membership
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {isAssignDialogOpen && (
        <AssignMembershipDialog 
          member={member}
          memberships={memberships}
          isOpen={isAssignDialogOpen}
          onClose={() => setIsAssignDialogOpen(false)}
          onSuccess={loadData}
        />
      )}
    </div>
  );
};

export default MemberDetail;
