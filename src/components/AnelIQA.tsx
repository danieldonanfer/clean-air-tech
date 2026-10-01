import { StyleSheet, View } from 'react-native';
import { Texto } from './Texto';
import { Circle, Svg } from 'react-native-svg';
import { colors, typography } from '../theme';
import { classificarIQA } from '../utils/iqa';

export interface AnelIQAProps {
  valor: number;
  tamanho?: number;
  /** Valor que corresponde à volta completa do anel. */
  escala?: number;
}

/**
 * Indicador circular do índice. Além da cor, mostra o número e o rótulo escrito
 * — não depender só da cor é requisito de acessibilidade do projeto.
 */
export function AnelIQA({ valor, tamanho = 184, escala = 150 }: AnelIQAProps) {
  const faixa = classificarIQA(valor);
  const traco = Math.max(8, Math.round(tamanho * 0.062));
  const raio = (tamanho - traco) / 2;
  const volta = 2 * Math.PI * raio;
  const fracao = Math.min(1, Math.max(0, valor / escala));

  return (
    <View
      style={[estilos.bloco, { width: tamanho, height: tamanho }]}
      accessibilityRole="image"
      accessibilityLabel={`Índice de qualidade do ar ${valor}, classificado como ${faixa.rotulo}`}
    >
      <Svg width={tamanho} height={tamanho} style={estilos.anel}>
        <Circle
          cx={tamanho / 2}
          cy={tamanho / 2}
          r={raio}
          stroke={colors.bordaClara}
          strokeWidth={traco}
          fill="none"
        />
        <Circle
          cx={tamanho / 2}
          cy={tamanho / 2}
          r={raio}
          stroke={faixa.cor}
          strokeWidth={traco}
          strokeLinecap="round"
          strokeDasharray={`${volta * fracao} ${volta}`}
          fill="none"
          // Começa no topo em vez de na direita.
          transform={`rotate(-90 ${tamanho / 2} ${tamanho / 2})`}
        />
      </Svg>

      <View style={estilos.centro}>
        <Texto style={[estilos.numero, { fontSize: tamanho * 0.28 }]}>{valor}</Texto>
        <Texto style={estilos.sigla}>IQA</Texto>
        <Texto style={[estilos.classificacao, { color: faixa.texto }]}>{faixa.rotulo}</Texto>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  bloco: { alignItems: 'center', justifyContent: 'center' },
  anel: { position: 'absolute' },
  centro: { alignItems: 'center' },
  numero: {
    fontWeight: typography.peso.extra,
    color: colors.texto,
    letterSpacing: -1.5,
    lineHeight: undefined,
  },
  sigla: {
    fontSize: typography.tamanho.micro,
    fontWeight: typography.peso.extra,
    letterSpacing: 1.5,
    color: colors.textoFraco,
  },
  classificacao: {
    marginTop: 2,
    fontSize: typography.tamanho.apoio,
    fontWeight: typography.peso.extra,
  },
});
