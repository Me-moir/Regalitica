"use client";
import { memo } from 'react';
import Overview from './OverviewGrids';
import DiscoverHeader from './DiscoverHeader';
import TheOrganization from './TheOrganization';
import TheCompany from './TheCompany';
import StrategicCapital from './StrategicCapital';

const Discover = () => {
  return (
    <div style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      {/* Discover Header */}
      <DiscoverHeader />

      {/* Overview Section */}
      <div id="section-overview">
        <Overview />
      </div>

      {/* About panel: company / direction / governance / reachout */}
      <div id="section-TheCompany">
        <TheCompany />
      </div>

      {/* Teams */}
      <div id="section-TheOrganization">
        <TheOrganization />
      </div>

      {/* StrategicCapital */}
      <div id="section-StrategicCapital">
        <StrategicCapital />
      </div>
    </div>
  );
};

export default Discover;