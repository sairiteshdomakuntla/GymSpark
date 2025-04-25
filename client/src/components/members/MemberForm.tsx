
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Member } from '../../types';
import { createMember, getMember, updateMember } from '../../services/dataService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

type MemberFormData = Omit<Member, 'id' | 'createdAt' | 'updatedAt'>;

const MemberForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<MemberFormData>();

  const isEditMode = !!id;

  useEffect(() => {
    if (isEditMode) {
      loadMember();
    }
  }, [id]);

  const loadMember = async () => {
    setIsLoading(true);
    try {
      const member = await getMember(id!);
      if (member) {
        reset({
          name: member.name,
          age: member.age,
          email: member.email,
          contactNumber: member.contactNumber,
          gender: member.gender,
          fitnessGoal: member.fitnessGoal,
        });
      } else {
        toast.error('Member not found');
        navigate('/members');
      }
    } catch (error) {
      console.error('Error loading member:', error);
      toast.error('Failed to load member details');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: MemberFormData) => {
    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await updateMember(id!, data);
        toast.success('Member updated successfully');
      } else {
        await createMember(data);
        toast.success('Member added successfully');
      }
      navigate('/members');
    } catch (error) {
      console.error('Error saving member:', error);
      toast.error(`Failed to ${isEditMode ? 'update' : 'add'} member`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-gym-purple border-solid rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => navigate('/members')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">
          {isEditMode ? 'Edit Member' : 'Add New Member'}
        </h1>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contactNumber">Contact Number</Label>
            <Input
              id="contactNumber"
              placeholder="123-456-7890"
              {...register('contactNumber', { required: 'Contact number is required' })}
            />
            {errors.contactNumber && <p className="text-red-500 text-sm">{errors.contactNumber.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              placeholder="30"
              {...register('age', { 
                required: 'Age is required',
                min: {
                  value: 16,
                  message: 'Age must be at least 16',
                },
                max: {
                  value: 100,
                  message: 'Age must be less than 100',
                },
                valueAsNumber: true,
              })}
            />
            {errors.age && <p className="text-red-500 text-sm">{errors.age.message}</p>}
          </div>
          
          <div className="space-y-3">
            <Label>Gender</Label>
            <RadioGroup 
              defaultValue="male" 
              className="flex space-x-4"
              value={register('gender', { required: 'Gender is required' }).value}
              onValueChange={(value) => setValue('gender', value as 'male' | 'female' | 'other')}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="gender-male" />
                <Label htmlFor="gender-male" className="cursor-pointer">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="gender-female" />
                <Label htmlFor="gender-female" className="cursor-pointer">Female</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="gender-other" />
                <Label htmlFor="gender-other" className="cursor-pointer">Other</Label>
              </div>
            </RadioGroup>
            {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="fitnessGoal">Fitness Goal</Label>
            <Textarea
              id="fitnessGoal"
              placeholder="Describe the member's fitness goals"
              className="min-h-[100px]"
              {...register('fitnessGoal', { required: 'Fitness goal is required' })}
            />
            {errors.fitnessGoal && <p className="text-red-500 text-sm">{errors.fitnessGoal.message}</p>}
          </div>
        </div>
        
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/members')}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-gym-purple hover:bg-gym-dark-purple"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Saving...
              </div>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isEditMode ? 'Update Member' : 'Save Member'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MemberForm;
