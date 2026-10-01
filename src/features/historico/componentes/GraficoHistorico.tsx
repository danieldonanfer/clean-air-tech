import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Texto } from '../../../components';
import { Circle, Defs, LinearGradient, Path, Stop, Svg } from 'react-native-svg';
import { colors, spacing, typography } from '../../../theme';
import type { PontoHistorico } from '../../../types/ar';

const ALTURA = 200;
const MARGEM = 16;

/**
 * Linha do índice no período. Desenhada com react-native-svg para sair igual ao
 * protótipo; a mesma figura aparece no celular e no navegador.
 *
 * A escala vertical não começa em zero de propósito: com valores entre 40 e 70,
 * um eixo a partir do zero achataria a linha e esconderia justamente a variação
 * que interessa. Os rótulos de topo e base dizem qual é o intervalo mostrado.
 */
export function GraficoHistorico({ pontos }: { pontos: PontoHistorico[] }) {
  // A largura vem do próprio contêiner: só ele sabe quanto sobrou depois das
  // colunas e dos respiros do cartão, em qualquer tamanho de tela.
  const [largura, setLargura] = useState(0);
  const valores = pontos.map((p) => p.iqa);
  const menor = Math.min(...valores);
  const maior = Math.max(...valores);
  const folga = Math.max(8, maior - menor) * 0.3;
  const topo = maior + folga;
  const base = Math.max(0, menor - folga);

  const x = (i: number) =>
    pontos.length === 1 ? largura / 2 : MARGEM + (i / (pontos.length - 1)) * (largura - MARGEM * 2);
  const y = (v: number) => ALTURA - MARGEM - ((v - base) / (topo - base)) * (ALTURA - MARGEM * 2.4);

  const linha = pontos.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i)} ${y(p.iqa)}`).join(' ');
  const area = `${linha} L${x(pontos.length - 1)} ${ALTURA} L${x(0)} ${ALTURA} Z`;

  return (
    <View onLayout={(e) => setLargura(Math.floor(e.nativeEvent.layout.width))}>
      {largura > 0 && (
        <Svg width={largura} height={ALTURA}>
          <Defs>
            <LinearGradient id="areaIQA" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={colors.primaria} stopOpacity="0.26" />
              <Stop offset="1" stopColor={colors.primaria} stopOpacity="0" />
            </LinearGradient>
          </Defs>

          <Path d={area} fill="url(#areaIQA)" />
          <Path
            d={linha}
            fill="none"
            stroke={colors.primaria}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {pontos.map((p, i) => (
            <Circle
              key={p.data}
              cx={x(i)}
              cy={y(p.iqa)}
              r={4}
              fill={colors.cartao}
              stroke={colors.primaria}
              strokeWidth={2.5}
            />
          ))}
        </Svg>
      )}

      <View style={estilos.rotulos}>
        {pontos.map((p) => (
          <Texto key={p.data} style={estilos.rotulo} numberOfLines={1}>
            {p.rotulo}
          </Texto>
        ))}
      </View>

      <Texto style={estilos.escala}>
        Eixo de {Math.round(base)} a {Math.round(topo)} · {pontos.length} amostras
      </Texto>
    </View>
  );
}

const estilos = StyleSheet.create({
  rotulos: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.pequeno },
  rotulo: {
    flex: 1,
    textAlign: 'center',
    fontSize: typography.tamanho.micro,
    fontWeight: typography.peso.semi,
    color: colors.textoFraco,
  },
  escala: {
    marginTop: spacing.pequeno,
    fontSize: typography.tamanho.micro,
    color: colors.textoTenue,
  },
});
