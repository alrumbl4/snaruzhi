import React from 'react';
import { View } from 'react-native';

type MockProps = Record<string, unknown> & { children?: React.ReactNode };

function MockNode({ children, ...props }: MockProps) {
  return <View {...props}>{children}</View>;
}

const builder = {
  addCircle: () => builder,
  build: () => ({ shape: 'circle' }),
};

const makeCirclePath = () => builder;

export const BlurMask = MockNode;
export const Canvas = MockNode;
export const Circle = MockNode;
export const Group = MockNode;
export const LinearGradient = MockNode;
export const Oval = MockNode;
export const Path = MockNode;
export const RadialGradient = MockNode;
export const Stop = MockNode;
export const Skia = {
  Path: {
    Make: () => ({ addCircle: () => undefined }),
    MakeFromSVGString: (path: string) => ({ path }),
  },
  PathBuilder: {
    Make: makeCirclePath,
  },
};
export const vec = (x: number, y: number) => ({ x, y });
export const usePathInterpolation = (_value: unknown, _input: number[], output: unknown[]) => ({
  value: output[0],
});
