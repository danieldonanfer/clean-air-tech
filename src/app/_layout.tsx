import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/plus-jakarta-sans';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FaixaPrototipo } from '../components';
import { ProvedorSessao } from '../store/sessao';
import { colors } from '../theme';

// A tela de abertura fica até as fontes chegarem: sem isso o texto piscaria da
// fonte do sistema para a Plus Jakarta Sans.
void SplashScreen.preventAutoHideAsync();

/**
 * Layout raiz (Expo Router). Define o navegador de topo e envolve o app nos
 * provedores. Cada arquivo em src/app é uma tela — a composição fica aqui e a
 * lógica de cada tela em src/features (ver docs/ARQUITETURA.md).
 */
export default function RootLayout() {
  const [carregadas, erro] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  useEffect(() => {
    if (carregadas || erro) void SplashScreen.hideAsync();
  }, [carregadas, erro]);

  // Se a fonte falhar, o app abre mesmo assim, com a fonte do sistema.
  if (!carregadas && !erro) return null;

  return (
    <SafeAreaProvider>
      <ProvedorSessao>
        <StatusBar style="dark" />
        {/* Só no navegador: é o site publicado que precisa avisar. No celular não há
            faixa, e a área segura do topo já é tratada por cada tela. */}
        <View style={estilos.raiz}>
          {Platform.OS === 'web' && <FaixaPrototipo />}
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.fundo },
            }}
          />
        </View>
      </ProvedorSessao>
    </SafeAreaProvider>
  );
}

const estilos = StyleSheet.create({ raiz: { flex: 1 } });
