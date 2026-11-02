export function getGrainOpacity(phase: number, index: number): number {
  'worklet';
  const wave = Math.max(0, Math.sin(phase * Math.PI * 2 + index * 1.73));

  return 0.3 + wave * 0.676;
}
