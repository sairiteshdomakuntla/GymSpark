
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Membership } from '../../types';
import { getMemberships, deleteMembership } from '../../services/dataService';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Search, Plus, Eye } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const MembershipsTable = () => {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [filteredMemberships, setFilteredMemberships] = useState<Membership[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [deletingMembershipId, setDeletingMembershipId] = useState<string | null>(null);

  useEffect(() => {
    loadMemberships();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = memberships.filter(membership => 
        membership.name.toLowerCase().includes(lowercasedSearch) ||
        membership.description.toLowerCase().includes(lowercasedSearch)
      );
      setFilteredMemberships(filtered);
    } else {
      setFilteredMemberships(memberships);
    }
  }, [searchTerm, memberships]);

  const loadMemberships = async () => {
    setIsLoading(true);
    try {
      const data = await getMemberships();
      setMemberships(data);
      setFilteredMemberships(data);
    } catch (error) {
      console.error('Failed to load memberships:', error);
      toast.error('Failed to load memberships. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMembership = async (id: string) => {
    setDeletingMembershipId(id);
    try {
      const success = await deleteMembership(id);
      if (success) {
        setMemberships(prevMemberships => prevMemberships.filter(membership => membership.id !== id));
        toast.success('Membership plan deleted successfully');
      } else {
        toast.error('Failed to delete membership plan');
      }
    } catch (error) {
      console.error('Error deleting membership:', error);
      toast.error('An error occurred while deleting the membership plan');
    } finally {
      setDeletingMembershipId(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search memberships..."
            className="pl-8 w-full sm:w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Link to="/memberships/new">
          <Button className="bg-gym-purple hover:bg-gym-dark-purple w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add New Plan
          </Button>
        </Link>
      </div>
      
      <div className="border rounded-lg overflow-hidden bg-white">
        {isLoading ? (
          <div className="p-8 flex justify-center">
            <div className="w-8 h-8 border-4 border-gym-purple border-solid rounded-full border-t-transparent animate-spin"></div>
          </div>
        ) : filteredMemberships.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan Name</TableHead>
                <TableHead className="hidden md:table-cell">Price</TableHead>
                <TableHead className="hidden md:table-cell">Duration</TableHead>
                <TableHead className="hidden lg:table-cell">Discount</TableHead>
                <TableHead className="hidden lg:table-cell">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMemberships.map((membership) => (
                <TableRow key={membership.id}>
                  <TableCell className="font-medium">{membership.name}</TableCell>
                  <TableCell className="hidden md:table-cell">{formatCurrency(membership.price)}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {membership.durationMonths} {membership.durationMonths === 1 ? 'month' : 'months'}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {membership.discount > 0 ? `${membership.discount}%` : '-'}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Badge variant={membership.active ? 'default' : 'secondary'} className={membership.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {membership.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link to={`/memberships/${membership.id}`}>
                        <Button variant="outline" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link to={`/memberships/edit/${membership.id}`}>
                        <Button variant="outline" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="icon" className="text-red-500 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Membership Plan</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete the {membership.name} plan? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteMembership(membership.id)}
                              className="bg-red-500 hover:bg-red-700"
                            >
                              {deletingMembershipId === membership.id ? (
                                <div className="flex items-center">
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                  Deleting...
                                </div>
                              ) : (
                                'Delete'
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-500">No membership plans found. Try a different search or add a new plan.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MembershipsTable;
