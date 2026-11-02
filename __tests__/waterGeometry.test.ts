import { createWaterPath, getWaterSurface } from '../lib/waterGeometry';

describe('getWaterSurface', () => {
  it('returns a gentle closed waterline inside the orb', () => {
    const surface = getWaterSurface(0);

    expect(surface).toHaveLength(5);
    expect(surface.every((y) => y >= 90 && y <= 116)).toBe(true);
  });

  it('builds a closed cubic path for the liquid fill', () => {
    const path = createWaterPath(0);

    expect(path).toMatch(/^M /);
    expect(path.match(/ C /g)).toHaveLength(4);
    expect(path).toMatch(/ Z$/);
  });

  it('gives the surface a visible but gentle range of motion', () => {
    const start = getWaterSurface(0);
    const later = getWaterSurface(6000);

    expect(Math.max(...start.map((y, index) => Math.abs(y - later[index])))).toBeGreaterThan(20);
  });

  it('changes gradually over time instead of jumping between wave states', () => {
    const start = getWaterSurface(0);
    const nearby = getWaterSurface(100);
    const later = getWaterSurface(4200);

    expect(Math.max(...start.map((y, index) => Math.abs(y - nearby[index])))).toBeLessThan(3);
    expect(later).not.toEqual(start);
  });
});
