import { StyleSheet } from 'react-native';
import { Texto } from './Texto';
import { colors, typography } from '../theme';

/** Rótulo de seção, em maiúsculas e com espaçamento entre letras. */
export function Rotulo({ children }: { children: string }) {
  return <Texto style={estilos.rotulo}>{children.toUpperCase()}</Texto>;
}

const estilos = StyleSheet.create({
  rotulo: {
    fontSize: typography.tamanho.mini,
    fontWeight: typography.peso.extra,
    letterSpacing: 1,
    color: colors.textoFraco,
  },
});
