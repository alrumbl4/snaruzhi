import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import {
  BlurMask,
  Canvas,
  Circle,
  Group,
  LinearGradient as SkiaLinearGradient,
  Oval,
  Path,
  RadialGradient,
  Skia,
  usePathInterpolation,
  vec,
} from '@shopify/react-native-skia';
import {
  cancelAnimation,
  Easing,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useEffect, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getGrainOpacity } from '../lib/sandShimmer';
import { createWaterPath } from '../lib/waterGeometry';

const HOME_TITLE = 'Заметь, что есть вокруг';

const GRAINS = [
  { x: 44, y: 158, radius: 1.6 },
  { x: 67, y: 184, radius: 1.2 },
  { x: 90, y: 199, radius: 1.7 },
  { x: 114, y: 174, radius: 1.2 },
  { x: 136, y: 190, radius: 1.7 },
  { x: 160, y: 209, radius: 1.2 },
  { x: 181, y: 181, radius: 1.6 },
  { x: 204, y: 197, radius: 1.2 },
  { x: 224, y: 163, radius: 1.6 },
  { x: 78, y: 218, radius: 1.2 },
  { x: 190, y: 222, radius: 1.2 },
  { x: 235, y: 207, radius: 1.5 },
] as const;

function SandGrain({
  x,
  y,
  radius,
  index,
  shimmer,
}: {
  x: number;
  y: number;
  radius: number;
  index: number;
  shimmer: ReturnType<typeof useSharedValue<number>>;
}) {
  const opacity = useDerivedValue(() => getGrainOpacity(shimmer.value, index));

  return (
    <Circle
      cx={x}
      cy={y}
      r={radius}
      opacity={opacity}
    >
      <RadialGradient
        c={vec(x - radius * 0.35, y - radius * 0.35)}
        r={radius * 2.6}
        colors={['#FFF8D3', '#F2D58A', '#B98232']}
        positions={[0, 0.58, 1]}
      />
    </Circle>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const waterProgress = useSharedValue(0);
  const backProgress = useSharedValue(0);
  const frontProgress = useSharedValue(0);
  const shimmer = useSharedValue(0);
  const waterClip = useMemo(
    () => Skia.PathBuilder.Make().addCircle(132, 132, 130).build(),
    [],
  );
  const glassArc = useMemo(
    () => Skia.Path.MakeFromSVGString('M 39 82 C 54 43 83 20 119 17')!,
    [],
  );
  const waterPaths = useMemo(
    () => [0, 2200, 5100, 7900].map((time) => Skia.Path.MakeFromSVGString(createWaterPath(time))!),
    [],
  );
  const backWavePaths = useMemo(
    () => [0, 2900, 6500, 9800].map((time) => Skia.Path.MakeFromSVGString(createWaterPath(time, -10))!),
    [],
  );
  const frontWavePaths = useMemo(
    () => [0, 1800, 4300, 7200].map((time) => Skia.Path.MakeFromSVGString(createWaterPath(time, 6))!),
    [],
  );
  const waterPath = usePathInterpolation(waterProgress, [0, 0.33, 0.67, 1], waterPaths);
  const backWavePath = usePathInterpolation(backProgress, [0, 0.33, 0.67, 1], backWavePaths);
  const frontWavePath = usePathInterpolation(frontProgress, [0, 0.33, 0.67, 1], frontWavePaths);

  useEffect(() => {
    waterProgress.value = withRepeat(
      withTiming(1, { duration: 9200, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
    backProgress.value = withRepeat(
      withTiming(1, { duration: 12600, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
    frontProgress.value = withRepeat(
      withTiming(1, { duration: 10400, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
    shimmer.value = withRepeat(
      withTiming(1, { duration: 6100, easing: Easing.linear }),
      -1,
      false,
    );

    return () => {
      cancelAnimation(waterProgress);
      cancelAnimation(backProgress);
      cancelAnimation(frontProgress);
      cancelAnimation(shimmer);
    };
  }, [backProgress, frontProgress, shimmer, waterProgress]);

  return (
    <LinearGradient
      colors={['#89B5B9', '#B9D8D4', '#F2F8EF', '#C5E8E0']}
      locations={[0, 0.38, 0.72, 1]}
      start={{ x: 0.05, y: 0 }}
      end={{ x: 0.95, y: 1 }}
      style={styles.background}
    >
      <StatusBar style="light" />
      <View pointerEvents="none" style={styles.decorations}>
        <View style={styles.skyGlow} />
        <View style={styles.sandShape} />
        <View style={styles.softShape} />
      </View>
      <View testID="header" style={[styles.header, { top: insets.top + 28 }]}>
        <View style={styles.titleStack}>
          {[
            styles.titleOutlineLeft,
            styles.titleOutlineRight,
            styles.titleOutlineTop,
            styles.titleOutlineBottom,
          ].map((outlineStyle, index) => (
            <Text
              key={index}
              accessible={false}
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
              testID="titleOutline"
              style={[styles.title, styles.titleOutline, outlineStyle]}
            >
              {HOME_TITLE}
            </Text>
          ))}
          <Text accessibilityRole="header" testID="homeTitle" style={styles.title}>
            Заметь, что есть вокруг
          </Text>
        </View>
        <Text
          accessible={false}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          pointerEvents="none"
          testID="titleSparkle"
          style={styles.titleSparkle}
        >
          ✦
        </Text>
      </View>
      <View testID="actionArea" style={styles.actionArea}>
        <Pressable testID="practiceButton" accessibilityRole="button" style={styles.button}>
          <View pointerEvents="none" style={styles.canvasFrame}>
            <Canvas testID="liquidCanvas" style={StyleSheet.absoluteFill}>
              <Group transform={[{ translateX: 20 }, { translateY: 20 }]}>
                <Oval rect={{ x: 36, y: 226, width: 192, height: 48 }} color="rgba(23,91,102,0.22)">
                  <BlurMask blur={12} />
                </Oval>
                <Group clip={waterClip}>
                  <Circle cx={132} cy={132} r={130} color="rgba(255,255,255,0.24)" />
                  <Circle cx={132} cy={132} r={130} opacity={0.28}>
                    <RadialGradient
                      c={vec(86, 52)}
                      r={235}
                      colors={['rgba(255,255,255,0.42)', 'rgba(255,255,255,0.02)']}
                      positions={[0, 1]}
                    />
                  </Circle>
                  <Path path={waterPath}>
                    <SkiaLinearGradient
                      start={vec(132, 135)}
                      end={vec(132, 264)}
                      colors={['#8ECBD0', '#5AA8B9', '#347F9D']}
                      positions={[0, 0.47, 1]}
                    />
                  </Path>
                  <Path path={backWavePath} color="#DDF3EA" opacity={0.25} />
                  <Path path={waterPath} color="#BFE7E2" opacity={0.18} />
                  <Path path={frontWavePath} color="#EDF9F0" opacity={0.18} />
                  {GRAINS.map((grain, index) => (
                    <SandGrain key={index} {...grain} index={index} shimmer={shimmer} />
                  ))}
                  <Path
                    path={glassArc!}
                    style="stroke"
                    strokeWidth={3}
                    strokeCap="round"
                    color="rgba(255,255,255,0.68)"
                  />
                  <Circle cx={209} cy={46} r={4.2} color="rgba(255,255,255,0.9)" />
                  <Circle cx={226} cy={54} r={2.4} color="rgba(255,255,255,0.78)" />
                </Group>
              </Group>
            </Canvas>
          </View>
          <Text style={styles.buttonText}>Начать короткую практику</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  decorations: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  skyGlow: {
    position: 'absolute',
    top: -80,
    right: -60,
    width: 310,
    height: 300,
    borderRadius: 155,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  sandShape: {
    position: 'absolute',
    bottom: -130,
    left: -110,
    width: 360,
    height: 300,
    borderRadius: 180,
    backgroundColor: 'rgba(255,248,231,0.62)',
    transform: [{ rotate: '-18deg' }],
  },
  softShape: {
    position: 'absolute',
    top: '48%',
    left: -55,
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: 'rgba(255,255,255,0.13)',
  },
  header: {
    position: 'absolute',
    left: 28,
    right: 28,
    alignItems: 'center',
    zIndex: 2,
  },
  titleStack: {
    position: 'relative',
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  title: {
    width: '100%',
    maxWidth: 340,
    color: '#FFFFFF',
    fontSize: 31,
    fontWeight: '700',
    lineHeight: 38,
    letterSpacing: 0.7,
    textAlign: 'center',
    textShadowColor: 'rgba(50,90,100,0.22)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 0,
  },
  titleOutline: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    color: 'rgba(43,82,89,0.48)',
  },
  titleOutlineLeft: { transform: [{ translateX: -1 }] },
  titleOutlineRight: { transform: [{ translateX: 1 }] },
  titleOutlineTop: { transform: [{ translateY: -1 }] },
  titleOutlineBottom: { transform: [{ translateY: 1 }] },
  titleSparkle: {
    position: 'absolute',
    top: 36,
    right: 42,
    color: '#F5D99B',
    fontSize: 13,
    lineHeight: 16,
  },
  actionArea: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  button: {
    position: 'relative',
    width: 264,
    height: 264,
    maxWidth: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    overflow: 'visible',
    borderRadius: 132,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.88)',
    backgroundColor: 'rgba(255,255,255,0.001)',
  },
  canvasFrame: {
    position: 'absolute',
    left: -20,
    top: -20,
    width: 304,
    height: 304,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 26,
    textAlign: 'center',
    flexShrink: 1,
    textShadowColor: 'rgba(17,76,103,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
    zIndex: 2,
  },
});
