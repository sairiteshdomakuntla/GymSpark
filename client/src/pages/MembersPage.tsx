
import DashboardLayout from '../components/layout/DashboardLayout';
import MembersTable from '../components/members/MembersTable';

const MembersPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Members</h1>
        <MembersTable />
      </div>
    </DashboardLayout>
  );
};

export default MembersPage;
