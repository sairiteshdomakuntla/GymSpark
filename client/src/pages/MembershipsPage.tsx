
import DashboardLayout from '../components/layout/DashboardLayout';
import MembershipsTable from '../components/memberships/MembershipsTable';

const MembershipsPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Membership Plans</h1>
        <MembershipsTable />
      </div>
    </DashboardLayout>
  );
};

export default MembershipsPage;
