
import { useState } from 'react';
import { createMembershipAssignment } from '../../services/dataService';
import { Member, Membership } from '../../types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { format, addMonths } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface AssignMembershipDialogProps {
  member: Member;
  memberships: Membership[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AssignMembershipDialog = ({ member, memberships, isOpen, onClose, onSuccess }: AssignMembershipDialogProps) => {
  const [selectedMembershipId, setSelectedMembershipId] = useState('');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const selectedMembership = memberships.find(m => m.id === selectedMembershipId);
  
  const handleAssign = async () => {
    if (!selectedMembershipId) {
      toast.error('Please select a membership plan');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const endDate = addMonths(startDate, selectedMembership?.durationMonths || 1);
      
      await createMembershipAssignment({
        memberId: member.id,
        membershipId: selectedMembershipId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        status: 'active',
        paymentStatus: 'paid'
      });
      
      toast.success('Membership assigned successfully');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error assigning membership:', error);
      toast.error('Failed to assign membership');
    } finally {
      setIsSubmitting(false);
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Membership</DialogTitle>
          <DialogDescription>
            Assign a membership plan to {member.name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="plan">Membership Plan</Label>
            <Select onValueChange={setSelectedMembershipId} value={selectedMembershipId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a plan" />
              </SelectTrigger>
              <SelectContent>
                {memberships.filter(m => m.active).map((membership) => (
                  <SelectItem key={membership.id} value={membership.id}>
                    {membership.name} - {formatCurrency(membership.price)} / {membership.durationMonths} {membership.durationMonths === 1 ? 'month' : 'months'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => date && setStartDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          {selectedMembership && (
            <div className="space-y-2 border-t pt-4 mt-4">
              <h3 className="font-medium">Membership Summary</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-gray-500">Plan:</span>
                <span>{selectedMembership.name}</span>
                
                <span className="text-gray-500">Price:</span>
                <span>{formatCurrency(selectedMembership.price)}</span>
                
                <span className="text-gray-500">Duration:</span>
                <span>{selectedMembership.durationMonths} {selectedMembership.durationMonths === 1 ? 'month' : 'months'}</span>
                
                <span className="text-gray-500">Start Date:</span>
                <span>{format(startDate, "PPP")}</span>
                
                <span className="text-gray-500">End Date:</span>
                <span>{format(addMonths(startDate, selectedMembership.durationMonths), "PPP")}</span>
                
                {selectedMembership.discount > 0 && (
                  <>
                    <span className="text-gray-500">Discount:</span>
                    <span>{selectedMembership.discount}%</span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleAssign} 
            className="bg-gym-purple hover:bg-gym-dark-purple"
            disabled={isSubmitting || !selectedMembershipId}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Assigning...
              </div>
            ) : (
              'Assign Membership'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignMembershipDialog;
