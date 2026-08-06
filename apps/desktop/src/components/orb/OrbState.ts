export type OrbState =
  | 'idle'
  | 'thinking'
  | 'listening'
  | 'speaking';

export interface OrbAnimationConfig {
  glowScale: number;
  pulseDuration: number;
  ringSpeed: number;
  orbitSpeed: number;
  glowOpacity: number;
}

export const ORB_CONFIG: Record<OrbState, OrbAnimationConfig> = {
  idle: {
    glowScale: 1,
    glowOpacity: 0.25,
    pulseDuration: 3,
    ringSpeed: 22,
    orbitSpeed: 28,
  },

  thinking: {
    glowScale: 1.2,
    glowOpacity: 0.45,
    pulseDuration: 1.6,
    ringSpeed: 10,
    orbitSpeed: 14,
  },

  listening: {
    glowScale: 1.1,
    glowOpacity: 0.35,
    pulseDuration: 1,
    ringSpeed: 16,
    orbitSpeed: 20,
  },

  speaking: {
    glowScale: 1.35,
    glowOpacity: 0.6,
    pulseDuration: 0.8,
    ringSpeed: 8,
    orbitSpeed: 12,
  },
};