import type { ReactNode } from 'react';

import { Header } from '../Header';
import { Main } from '../Main';
import { Sidebar } from '../Sidebar';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({
  children,
}: AppLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#05070D] text-white">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Header />

        <Main>
          {children}
        </Main>
      </div>
    </div>
  );
}
