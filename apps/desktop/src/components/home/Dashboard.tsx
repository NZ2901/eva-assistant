import {
  Activity,
  Brain,
  Cpu,
  Mic,
} from 'lucide-react';

import { DashboardHero } from './DashboardHero';
import { InfoPanel } from './InfoPanel';
import { Orb } from '../orb';

export function Dashboard() {
  return (
    <div className="space-y-14">
      <section
        className="
          flex
          items-center
          justify-between
          gap-10
        "
      >
        {/* Painéis da esquerda */}
        <div className="flex w-[300px] flex-col gap-6">
          <InfoPanel
            icon={Cpu}
            title="Model"
            value="Gemini 2.5 Flash"
          />

          <InfoPanel
            icon={Brain}
            title="Memory"
            value="124 registros"
          />
        </div>

        {/* Orb */}
        <div className="flex flex-1 justify-center">
          <Orb state="idle" />
        </div>

        {/* Painéis da direita */}
        <div className="flex w-[300px] flex-col gap-6">
          <InfoPanel
            icon={Activity}
            title="Status"
            value="Idle"
          />

          <InfoPanel
            icon={Mic}
            title="Voice"
            value="Offline"
          />
        </div>
      </section>

      <DashboardHero />
    </div>
  );
}