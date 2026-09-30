import { StyleSheet, View } from 'react-native';
import { Icone, Texto } from '../../../components';
import { colors, spacing, typography } from '../../../theme';

/** Cabeçalho de marca das telas de acesso. */
export function MarcaAcesso() {
  return (
    <View style={estilos.bloco}>
      <Icone nome="marca" tamanho={34} cor={colors.primaria} traco={2.4} />
      <Texto style={estilos.nome}>CleanAirTech</Texto>
      <Texto style={estilos.apoio}>Sistema de Gestão</Texto>
    </View>
  );
}

const estilos = StyleSheet.create({
  bloco: { alignItems: 'center', gap: spacing.mini, paddingVertical: spacing.maior },
  nome: {
    fontSize: typography.tamanho.cabecalhoGrande,
    fontWeight: typography.peso.extra,
    color: colors.texto,
    letterSpacing: -0.8,
  },
  apoio: { fontSize: typography.tamanho.corpoGrande, color: colors.textoApoio },
});
