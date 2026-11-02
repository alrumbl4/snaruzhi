import { getGrainOpacity } from '../lib/sandShimmer';

describe('getGrainOpacity', () => {
  it('gives grains a bright, clearly visible shimmer range', () => {
    const values = Array.from({ length: 24 }, (_, step) => getGrainOpacity(step / 24, 3));
    const min = Math.min(...values);
    const max = Math.max(...values);

    expect(max - min).toBeGreaterThan(0.65);
    expect(max).toBeGreaterThan(0.94);
    expect(min).toBeLessThan(0.36);
  });
});
