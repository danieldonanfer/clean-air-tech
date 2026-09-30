import { StyleSheet, View } from 'react-native';
import { Cartao, Texto } from '../../../components';
import { colors, radius, spacing, typography } from '../../../theme';

export interface CartaoSensorProps {
  nome: string;
  apoio: string;
  valor: string;
  unidade: string;
  /** Valor numérico e limite de referência, para a barra de ocupação. */
  bruto?: number;
  limite?: number;
}

export function CartaoSensor({ nome, apoio, valor, unidade, bruto, limite }: CartaoSensorProps) {
  const ocupacao = limite && bruto !== undefined ? Math.min(1, bruto / limite) : null;
  const acima = ocupacao !== null && ocupacao >= 1;

  return (
    <Cartao estilo={estilos.cartao}>
      <Texto style={estilos.nome}>{nome}</Texto>
      <View style={estilos.linhaValor}>
        <Texto style={estilos.valor}>{valor}</Texto>
        <Texto style={estilos.unidade}>{unidade}</Texto>
      </View>
      <Texto style={estilos.apoio}>{apoio}</Texto>

      {ocupacao !== null && (
        <View
          style={estilos.trilha}
          accessibilityRole="progressbar"
          accessibilityLabel={`${nome}: ${valor} ${unidade}, limite de referência ${limite} ${unidade}`}
        >
          <View
            style={[
              estilos.preenchimento,
              {
                width: `${ocupacao * 100}%`,
                backgroundColor: acima ? colors.atencaoForte : colors.primaria,
              },
            ]}
          />
        </View>
      )}
    </Cartao>
  );
}

const estilos = StyleSheet.create({
  cartao: { flexGrow: 1, flexBasis: '45%', padding: spacing.medio + 2, gap: spacing.micro },
  nome: {
    fontSize: typography.tamanho.minuscula,
    fontWeight: typography.peso.extra,
    color: colors.primaria,
  },
  linhaValor: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.mini,
    marginTop: spacing.mini,
  },
  valor: {
    fontSize: typography.tamanho.cabecalho,
    fontWeight: typography.peso.extra,
    color: colors.texto,
    letterSpacing: -0.6,
  },
  unidade: {
    fontSize: typography.tamanho.mini,
    fontWeight: typography.peso.semi,
    color: colors.textoFraco,
  },
  apoio: { fontSize: typography.tamanho.mini, color: colors.textoFraco },
  trilha: {
    height: 4,
    borderRadius: radius.pilula,
    backgroundColor: colors.bordaClara,
    marginTop: spacing.pequeno,
    overflow: 'hidden',
  },
  preenchimento: { height: '100%', borderRadius: radius.pilula },
});
