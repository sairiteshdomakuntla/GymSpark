
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Membership } from '../../types';
import { createMembership, getMembership, updateMembership } from '../../services/dataService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

type MembershipFormData = Omit<Membership, 'id' | 'createdAt' | 'updatedAt'>;

const MembershipForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<MembershipFormData>();

  const isEditMode = !!id;
  const active = watch('active');

  useEffect(() => {
    if (isEditMode) {
      loadMembership();
    } else {
      // Set default values for new memberships
      setValue('active', true);
      setValue('discount', 0);
      setValue('features', []);
    }
  }, [id]);

  const loadMembership = async () => {
    setIsLoading(true);
    try {
      const membership = await getMembership(id!);
      if (membership) {
        reset({
          name: membership.name,
          description: membership.description,
          price: membership.price,
          durationMonths: membership.durationMonths,
          features: membership.features,
          discount: membership.discount,
          active: membership.active,
        });
        setFeatures(membership.features);
      } else {
        toast.error('Membership plan not found');
        navigate('/memberships');
      }
    } catch (error) {
      console.error('Error loading membership:', error);
      toast.error('Failed to load membership details');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: MembershipFormData) => {
    data.features = features;
    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await updateMembership(id!, data);
        toast.success('Membership plan updated successfully');
      } else {
        await createMembership(data);
        toast.success('Membership plan added successfully');
      }
      navigate('/memberships');
    } catch (error) {
      console.error('Error saving membership:', error);
      toast.error(`Failed to ${isEditMode ? 'update' : 'add'} membership plan`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addFeature = () => {
    if (newFeature.trim() !== '') {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
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
          onClick={() => navigate('/memberships')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">
          {isEditMode ? 'Edit Membership Plan' : 'Add New Membership Plan'}
        </h1>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Plan Name</Label>
            <Input
              id="name"
              placeholder="Basic, Premium, etc."
              {...register('name', { required: 'Plan name is required' })}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-500">$</span>
              <Input
                id="price"
                type="number"
                placeholder="99.99"
                className="pl-8"
                step="0.01"
                min="0"
                {...register('price', { 
                  required: 'Price is required',
                  min: {
                    value: 0,
                    message: 'Price must be positive',
                  },
                  valueAsNumber: true,
                })}
              />
            </div>
            {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="durationMonths">Duration (months)</Label>
            <Input
              id="durationMonths"
              type="number"
              placeholder="1"
              min="1"
              max="36"
              {...register('durationMonths', { 
                required: 'Duration is required',
                min: {
                  value: 1,
                  message: 'Duration must be at least 1 month',
                },
                max: {
                  value: 36,
                  message: 'Duration cannot exceed 36 months',
                },
                valueAsNumber: true,
              })}
            />
            {errors.durationMonths && <p className="text-red-500 text-sm">{errors.durationMonths.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="discount">Discount Percentage</Label>
            <div className="relative">
              <Input
                id="discount"
                type="number"
                placeholder="10"
                min="0"
                max="100"
                className="pr-8"
                {...register('discount', { 
                  required: 'Discount is required',
                  min: {
                    value: 0,
                    message: 'Discount cannot be negative',
                  },
                  max: {
                    value: 100,
                    message: 'Discount cannot exceed 100%',
                  },
                  valueAsNumber: true,
                })}
              />
              <span className="absolute right-3 top-2.5 text-gray-500">%</span>
            </div>
            {errors.discount && <p className="text-red-500 text-sm">{errors.discount.message}</p>}
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the membership plan's benefits"
              className="min-h-[100px]"
              {...register('description', { required: 'Description is required' })}
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label>Features</Label>
            <div className="space-y-4">
              <div className="flex">
                <Input
                  placeholder="Add a feature (e.g., 'Gym access', 'Personal trainer')"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  className="rounded-r-none"
                />
                <Button 
                  type="button" 
                  className="rounded-l-none bg-gym-purple hover:bg-gym-dark-purple"
                  onClick={addFeature}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-2">
                {features.length > 0 ? (
                  features.map((feature, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <span>{feature}</span>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:text-red-700"
                        onClick={() => removeFeature(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm italic">No features added yet.</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={active}
              onCheckedChange={(checked) => setValue('active', checked)}
            />
            <Label htmlFor="active" className="cursor-pointer">
              Plan Active
            </Label>
          </div>
        </div>
        
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/memberships')}
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
                {isEditMode ? 'Update Plan' : 'Save Plan'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MembershipForm;
