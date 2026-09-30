import { Stack } from 'expo-router';

/**
 * Root layout (Expo Router). Defines the app's top-level navigator.
 * Feature screens are added as files under src/app/ — do not put
 * components, hooks or business logic in this directory (see docs/ARQUITETURA.md).
 */
export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
