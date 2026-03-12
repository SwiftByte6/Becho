import DashboardLayout from '@/components/layout/DashboardLayout';
import { getUser } from '@/lib/auth/getUser';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Dashboard | Becho',
};

export default async function DashboardRootLayout({ children }) {
  const user = await getUser();

  if (!user) {
    redirect('/auth');
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
