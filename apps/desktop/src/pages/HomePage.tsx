import { AppLayout } from '../components/layout/AppLayout';
import { Dashboard } from '../components/dashboard';

export function HomePage() {
  return (
    <AppLayout>
      <Dashboard />
    </AppLayout>
  );
}