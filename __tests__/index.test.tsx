import { fireEvent, render } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import HomeScreen from '../app/index';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const renderHomeScreen = () =>
  render(
    <SafeAreaProvider
      initialMetrics={{
        frame: { x: 0, y: 0, width: 390, height: 844 },
        insets: { top: 24, right: 0, bottom: 34, left: 0 },
      }}
    >
      <HomeScreen />
    </SafeAreaProvider>,
  );

describe('HomeScreen', () => {
  it('shows the invitation and exactly one practice button', async () => {
    const { getByText, getAllByRole } = await renderHomeScreen();

    expect(getByText('Заметь, что есть вокруг')).toBeTruthy();
    expect(getAllByRole('button')).toHaveLength(1);
    expect(getByText('Начать короткую практику')).toBeTruthy();
  });

  it('centers the button in the full screen area below the safe inset', async () => {
    const { getByTestId } = await renderHomeScreen();

    expect(getByTestId('actionArea').props.style).toMatchObject({
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      justifyContent: 'center',
      alignItems: 'center',
    });
  });

  it('keeps the title clear of the status bar with a deliberate top gap', async () => {
    const { getByTestId } = await renderHomeScreen();
    const headerStyle = StyleSheet.flatten(getByTestId('header').props.style);

    expect(headerStyle.top).toBeGreaterThanOrEqual(52);
  });

  it('centers the cloud title and shows a separate decorative sparkle', async () => {
    const { getByTestId } = await renderHomeScreen();

    expect(getByTestId('homeTitle').props.style).toMatchObject({ textAlign: 'center' });
    expect(getByTestId('titleSparkle', { includeHiddenElements: true })).toBeTruthy();
  });

  it('adds a crisp contrast edge without duplicating accessible title text', async () => {
    const { getAllByTestId, getByText } = await renderHomeScreen();

    expect(getAllByTestId('titleOutline', { includeHiddenElements: true })).toHaveLength(4);
    expect(getByText('Заметь, что есть вокруг')).toBeTruthy();
  });

  it('draws the glass fill inside Skia instead of a native octagonal backdrop', async () => {
    const { getByTestId } = await renderHomeScreen();
    const buttonStyle = StyleSheet.flatten(getByTestId('practiceButton').props.style);
    const canvasStyle = StyleSheet.flatten(getByTestId('liquidCanvas').props.style);

    expect(buttonStyle.backgroundColor).toBe('rgba(255,255,255,0.001)');
    expect(canvasStyle.position).toBe('absolute');
  });

  it('renders the liquid artwork on a Skia canvas', async () => {
    const { getByTestId } = await renderHomeScreen();

    expect(getByTestId('liquidCanvas')).toBeTruthy();
  });

  it('keeps the sparkle beside the title, below the status bar', async () => {
    const { getByTestId } = await renderHomeScreen();

    expect(getByTestId('titleSparkle', { includeHiddenElements: true }).props.style.top).toBeGreaterThan(0);
  });

  it('stays on the same screen after pressing the button', async () => {
    const { getByRole, getByText } = await renderHomeScreen();

    await fireEvent.press(getByRole('button'));

    expect(getByText('Заметь, что есть вокруг')).toBeTruthy();
    expect(getByText('Начать короткую практику')).toBeTruthy();
  });
});
