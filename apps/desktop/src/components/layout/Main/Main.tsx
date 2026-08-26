import type { ReactNode } from 'react';

interface MainProps {
  children: ReactNode;
}

export function Main({
  children,
}: MainProps) {
  return (
    <main
      className="
        flex-1
        overflow-y-auto
        px-8
        py-6
      "
    >
      {children}
    </main>
  );
}
