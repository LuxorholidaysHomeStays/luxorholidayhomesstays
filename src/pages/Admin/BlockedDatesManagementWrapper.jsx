import React from 'react';
import BlockedDatesManagement from './BlockedDatesManagement';
import AdminDashboard from '../../components/Adminpanel/AdminDashboard';

const BlockedDatesManagementWrapper = () => {
  return (
    <AdminDashboard>
      <BlockedDatesManagement />
    </AdminDashboard>
  );
};

export default BlockedDatesManagementWrapper;
