import { OrbCore } from './OrbCore';
import { OrbGlow } from './OrbGlow';
import { OrbOrbit } from './OrbOrbit';
import { OrbPulse } from './OrbPulse';
import { OrbRing } from './OrbRing';
import { ORB_CONFIG } from './OrbState';
import type { OrbState } from './OrbState';

interface OrbProps {
  state?: OrbState;
}

export function Orb({
  state = 'idle',
}: OrbProps) {
  const config = ORB_CONFIG[state];

  return (
    <div
      className="
        relative
        flex
        h-[560px]
        w-[560px]
        items-center
        justify-center
      "
    >
      {/* Halo */}
      <div
        className="
          absolute
          h-[760px]
          w-[760px]
          rounded-full
          bg-[radial-gradient(circle,rgba(59,130,246,.08),transparent_70%)]
          blur-[120px]
          pointer-events-none
        "
      />

      {/* Glow */}
      <OrbGlow
        scale={config.glowScale}
        opacity={config.glowOpacity}
      />

      {/* Pulso */}
      <OrbPulse
        duration={config.pulseDuration}
      />

      {/* Órbita externa */}
      <OrbOrbit
        size={450}
        duration={config.orbitSpeed + 8}
        particles={5}
        reverse
      />

      {/* Órbita interna */}
      <OrbOrbit
        size={360}
        duration={config.orbitSpeed}
        particles={8}
      />

      {/* Anel externo */}
      <OrbRing
        size={520}
        duration={config.ringSpeed + 10}
        dashed
      />

      {/* Anel intermediário */}
      <OrbRing
        size={430}
        duration={config.ringSpeed + 5}
        reverse
      />

      {/* Anel interno */}
      <OrbRing
        size={340}
        duration={config.ringSpeed}
      />

      {/* Núcleo */}
      <OrbCore />

      {/* Estado (temporário) */}
      <div
        className="
          absolute
          bottom-6
          rounded-full
          border
          border-blue-500/20
          bg-blue-500/5
          px-4
          py-1
          text-[11px]
          uppercase
          tracking-[0.35em]
          text-blue-300/60
        "
      >
        {state}
      </div>
    </div>
  );
}