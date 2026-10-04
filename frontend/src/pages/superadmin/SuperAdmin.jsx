import React from 'react';
import { OverviewTab } from './OverviewTab';
import { useOutletContext } from 'react-router-dom';

export const SuperAdminDashboard = () => {
  const outletContext = useOutletContext();
  const handleOpenAddModal = outletContext?.handleOpenAddModal || (() => {});

  return <OverviewTab onOpenAddModal={handleOpenAddModal} />;
};

export default SuperAdminDashboard;
