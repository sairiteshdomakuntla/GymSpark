import { useState } from 'react';
import { createMembershipAssignment } from '../../services/dataService';
import { Member, Membership } from '../../types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format, addMonths } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface AssignMembershipDialogProps {
  member: Member;
  memberships: Membership[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AssignMembershipDialog = ({
  member,
  memberships,
  isOpen,
  onClose,
  onSuccess
}: AssignMembershipDialogProps) => {
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
    } catch (error: any) {
      console.error('Error assigning membership:', error);
      const errorMessage = error.message || 'Failed to assign membership';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
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
            <Label>Membership Plan</Label>
            <Select onValueChange={setSelectedMembershipId} value={selectedMembershipId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a plan" />
              </SelectTrigger>
              <SelectContent>
                {memberships.map((membership) => (
                  <SelectItem key={membership.id} value={membership.id}>
                    {membership.name} - ${membership.price} / {membership.durationMonths} months
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
                  {startDate ? format(startDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => date && setStartDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            className="bg-gym-purple hover:bg-gym-dark-purple"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
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
