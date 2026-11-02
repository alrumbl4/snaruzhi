export type WaterSurface = readonly [number, number, number, number, number];

export function getWaterSurface(timeMs: number): WaterSurface {
  const seconds = timeMs / 1000;

  return [
    102 + Math.sin(seconds * 0.58) * 9.4,
    99 + Math.sin(seconds * 0.49 + 1.7) * 10.9,
    105 + Math.sin(seconds * 0.43 + 3.4) * 9.9,
    101 + Math.sin(seconds * 0.53 + 5.1) * 10.7,
    103 + Math.sin(seconds * 0.47 + 2.3) * 9.1,
  ];
}

export function createWaterPath(timeMs: number, lift = 0): string {
  const [left, first, middle, last, right] = getWaterSurface(timeMs);
  const offset = (value: number) => value + lift;

  return `M -8 ${offset(left)} C 12 ${offset(left - 3)} 34 ${offset(first + 5)} 56 ${offset(first)} C 78 ${offset(first - 4)} 104 ${offset(middle + 7)} 132 ${offset(middle)} C 158 ${offset(middle - 7)} 180 ${offset(last - 4)} 204 ${offset(last)} C 230 ${offset(last + 5)} 250 ${offset(right + 4)} 272 ${offset(right)} L 272 280 L -8 280 Z`;
}
