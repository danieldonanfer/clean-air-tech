import { StyleSheet, Text, View } from 'react-native';

/**
 * PLACEHOLDER — this route exists only so the router has an entry point.
 * Replace with the real initial screen when frontend development starts
 * (see docs/ARQUITETURA.md for where feature screens should live).
 */
export default function PlaceholderHomeScreen() {
  return (
    <View style={styles.container}>
      <Text>clean-air-tech — placeholder screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
