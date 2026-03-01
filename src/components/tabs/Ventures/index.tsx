"use client";
import { useState } from 'react';
import DefenseTab from './Defense';
import CivicTab from './Civic';
import HealthcareTab from './Healthcare';

type VenturesSubtab = 'ventures-defense' | 'ventures-civic-operations' | 'ventures-healthcare';

interface VenturesProps {
  activeSubtab?: string;
}

const Ventures = ({ activeSubtab }: VenturesProps) => {
  const active: VenturesSubtab =
    activeSubtab === 'ventures-defense' || activeSubtab === 'ventures-civic-operations' || activeSubtab === 'ventures-healthcare'
      ? activeSubtab
      : 'ventures-defense';

  return (
    <>
      {active === 'ventures-defense' && <DefenseTab />}
      {active === 'ventures-civic-operations' && <CivicTab />}
      {active === 'ventures-healthcare' && <HealthcareTab />}
    </>
  );
};

export default Ventures;