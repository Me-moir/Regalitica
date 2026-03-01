import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NR Defense Systems',
  description: 'Notus Regalia — Defense Systems Division',
};

export default function DefenseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
