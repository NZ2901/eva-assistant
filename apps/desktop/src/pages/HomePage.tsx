import { AppLayout } from '../components/layout/AppLayout';
import { Dashboard } from '../components/home';

export function HomePage() {
  return (
    <AppLayout>
      <Dashboard />
    </AppLayout>
  );
}