import { StyleSheet, View } from 'react-native';
import { Texto } from '../../../components';
import { colors, radius, spacing, typography } from '../../../theme';

export interface MetricaChaveProps {
  nome: string;
  valor: string;
  unidade: string;
  /** Quanto o valor ocupa do limite, de 0 a 1 ou mais. */
  ocupacao: number;
  referencia: string;
  rotuloBom: string;
}

/** Uma média do período comparada com o seu limite de referência. */
export function MetricaChave({
  nome,
  valor,
  unidade,
  ocupacao,
  referencia,
  rotuloBom,
}: MetricaChaveProps) {
  const dentro = ocupacao <= 1;
  return (
    <View style={estilos.bloco}>
      <Texto style={estilos.nome}>{nome}</Texto>
      <View style={estilos.linhaValor}>
        <Texto style={estilos.valor}>{valor}</Texto>
        <Texto style={estilos.unidade}>{unidade}</Texto>
      </View>

      <View
        style={estilos.trilha}
        accessibilityRole="progressbar"
        accessibilityLabel={`${nome}: ${valor} ${unidade}, ${referencia}`}
      >
        <View
          style={[
            estilos.preenchimento,
            {
              width: `${Math.min(100, ocupacao * 100)}%`,
              backgroundColor: dentro ? colors.primaria : colors.atencaoForte,
            },
          ]}
        />
      </View>

      <View style={estilos.legenda}>
        <Texto style={[estilos.situacao, { color: dentro ? colors.sucesso : colors.atencao }]}>
          {dentro ? rotuloBom : 'Acima do recomendado'}
        </Texto>
        <Texto style={estilos.referencia}>{referencia}</Texto>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  bloco: { gap: spacing.mini },
  nome: {
    fontSize: typography.tamanho.apoio,
    fontWeight: typography.peso.forte,
    color: colors.textoForte,
  },
  linhaValor: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.mini },
  valor: {
    fontSize: typography.tamanho.numeroMedio,
    fontWeight: typography.peso.extra,
    color: colors.texto,
    letterSpacing: -0.6,
  },
  unidade: {
    fontSize: typography.tamanho.mini,
    fontWeight: typography.peso.semi,
    color: colors.textoFraco,
  },
  trilha: {
    height: 6,
    borderRadius: radius.pilula,
    backgroundColor: colors.bordaClara,
    marginTop: spacing.pequeno - 2,
    overflow: 'hidden',
  },
  preenchimento: { height: '100%', borderRadius: radius.pilula },
  legenda: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.pequeno },
  situacao: { fontSize: typography.tamanho.mini, fontWeight: typography.peso.forte },
  referencia: { fontSize: typography.tamanho.mini, color: colors.textoFraco },
});
