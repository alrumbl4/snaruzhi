jest.mock('react-native-reanimated', () => {
  const identity = (value) => value;

  return {
    cancelAnimation: jest.fn(),
    Easing: {
      inOut: identity,
      linear: identity,
      sin: identity,
    },
    useDerivedValue: (callback) => ({ value: callback() }),
    useSharedValue: (value) => ({ value }),
    withRepeat: (animation) => animation,
    withTiming: (value) => ({ value }),
  };
});
