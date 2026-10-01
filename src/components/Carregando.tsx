import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Texto } from './Texto';
import { colors, spacing, typography } from '../theme';

/** Estado de espera de tela inteira. */
export function Carregando({ texto = 'Carregando…' }: { texto?: string }) {
  return (
    <View style={estilos.bloco} accessibilityRole="progressbar" accessibilityLabel={texto}>
      <ActivityIndicator size="large" color={colors.primaria} />
      <Texto style={estilos.texto}>{texto}</Texto>
    </View>
  );
}

const estilos = StyleSheet.create({
  bloco: {
    flex: 1,
    backgroundColor: colors.fundo,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.medio,
  },
  texto: { fontSize: typography.tamanho.apoio, color: colors.textoApoio },
});
