import { StyleSheet, View } from 'react-native';
import { colors, spacing, typography } from '../theme';
import { Texto } from './Texto';

/**
 * Faixa fixa no topo avisando que o que se vê é um protótipo. Quem abre o site
 * publicado não pode confundir os números simulados com leituras de um sensor.
 */
export function FaixaPrototipo() {
  return (
    <View style={estilos.faixa} accessibilityRole="alert">
      <Texto style={estilos.texto}>
        Protótipo do TCC · dados simulados, sem conexão com o dispositivo
      </Texto>
    </View>
  );
}

const estilos = StyleSheet.create({
  faixa: {
    backgroundColor: colors.atencaoFundo,
    paddingVertical: spacing.mini,
    paddingHorizontal: spacing.medio,
    alignItems: 'center',
  },
  texto: {
    fontSize: typography.tamanho.mini,
    fontWeight: typography.peso.semi,
    color: colors.atencao,
    textAlign: 'center',
  },
});
