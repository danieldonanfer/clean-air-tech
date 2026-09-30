import { StyleSheet, View } from 'react-native';
import { Cartao, Rotulo, Texto } from '../../../components';
import type { PontoDoDia } from '../../../types/ar';
import { colors, radius, spacing, typography } from '../../../theme';
import { classificarIQA } from '../../../utils/iqa';

/** Barras do índice ao longo do dia. As horas ainda por vir ficam esmaecidas. */
export function FaixaDeHoras({ pontos }: { pontos: PontoDoDia[] }) {
  const maior = Math.max(...pontos.map((p) => p.iqa), 1);

  return (
    <Cartao>
      <Rotulo>Índice ao longo do dia</Rotulo>
      <View style={estilos.barras}>
        {pontos.map((ponto) => {
          const faixa = classificarIQA(ponto.iqa);
          return (
            <View
              key={ponto.rotulo}
              style={estilos.coluna}
              accessibilityLabel={`${ponto.rotulo}: índice ${ponto.iqa}, ${faixa.rotulo}${ponto.futuro ? ', projeção' : ''}`}
            >
              <Texto style={estilos.numero}>{ponto.iqa}</Texto>
              <View style={estilos.trilha}>
                <View
                  style={[
                    estilos.barra,
                    {
                      height: `${Math.max(8, (ponto.iqa / maior) * 100)}%`,
                      backgroundColor: faixa.cor,
                      opacity: ponto.futuro ? 0.35 : 1,
                    },
                  ]}
                />
              </View>
              <Texto style={estilos.hora}>{ponto.rotulo}</Texto>
            </View>
          );
        })}
      </View>
    </Cartao>
  );
}

const estilos = StyleSheet.create({
  barras: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.pequeno,
    marginTop: spacing.medio,
  },
  coluna: { flex: 1, alignItems: 'center', gap: spacing.mini },
  numero: {
    fontSize: typography.tamanho.micro,
    fontWeight: typography.peso.forte,
    color: colors.textoFraco,
  },
  trilha: { height: 96, width: '100%', justifyContent: 'flex-end' },
  barra: { width: '100%', borderRadius: radius.pequeno, minHeight: 6 },
  hora: {
    fontSize: typography.tamanho.micro,
    fontWeight: typography.peso.semi,
    color: colors.textoFraco,
  },
});
