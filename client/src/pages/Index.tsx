
import { useEffect, useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import StatCard from '../components/dashboard/StatCard';
import RecentMembersList from '../components/dashboard/RecentMembersList';
import ActiveMembershipsList from '../components/dashboard/ActiveMembershipsList';
import { getDashboardStats } from '../services/dataService';
import { Users, CreditCard, DollarSign, Calendar } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMemberships: 0,
    expiredMemberships: 0,
    totalRevenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setIsLoading(true);
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total Members" 
            value={stats.totalMembers}
            description="Registered gym members"
            icon={<Users className="h-4 w-4" />}
          />
          <StatCard 
            title="Active Memberships" 
            value={stats.activeMemberships}
            description="Currently active plans"
            icon={<CreditCard className="h-4 w-4" />}
          />
          <StatCard 
            title="Expired Memberships" 
            value={stats.expiredMemberships}
            description="Memberships to renew"
            icon={<Calendar className="h-4 w-4" />}
          />
          <StatCard 
            title="Total Revenue" 
            value={formatCurrency(stats.totalRevenue)}
            description="From all memberships"
            icon={<DollarSign className="h-4 w-4" />}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RecentMembersList />
          <ActiveMembershipsList />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
