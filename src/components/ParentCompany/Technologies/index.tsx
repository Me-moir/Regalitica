"use client";
import { useState } from 'react';
import DefenseTab from './Defense';
import CivicTab from './Civic';
import HealthcareTab from './Healthcare';

type TechnologiesSubtab = 'technologies-defense' | 'technologies-civic-operations' | 'technologies-healthcare';

interface TechnologiesProps {
  activeSubtab?: string;
}

const Technologies = ({ activeSubtab }: TechnologiesProps) => {
  const active: TechnologiesSubtab =
    activeSubtab === 'technologies-defense' || activeSubtab === 'technologies-civic-operations' || activeSubtab === 'technologies-healthcare'
      ? activeSubtab
      : 'technologies-defense';

  return (
    <>
      {active === 'technologies-defense' && <DefenseTab />}
      {active === 'technologies-civic-operations' && <CivicTab />}
      {active === 'technologies-healthcare' && <HealthcareTab />}
    </>
  );
};

export default Technologies;