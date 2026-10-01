import { StyleSheet, View } from 'react-native';
import { Texto } from './Texto';
import { colors, radius, spacing, typography } from '../theme';
import { Cartao } from './Cartao';
import { Icone, type NomeDeIcone } from './Icone';

export interface LinhaMenuProps {
  icone: NomeDeIcone;
  titulo: string;
  apoio?: string;
  aoTocar?: () => void;
  perigo?: boolean;
}

/** Item de lista das telas de configuração. */
export function LinhaMenu({ icone, titulo, apoio, aoTocar, perigo = false }: LinhaMenuProps) {
  const cor = perigo ? colors.perigo : colors.primaria;
  return (
    <Cartao
      aoTocar={aoTocar}
      rotuloAcessivel={titulo}
      estilo={[estilos.cartao, perigo && estilos.cartaoPerigo]}
    >
      <View style={estilos.linha}>
        <View
          style={[
            estilos.moldura,
            { backgroundColor: perigo ? colors.perigoFundoSuave : colors.bordaClara },
          ]}
        >
          <Icone nome={icone} tamanho={19} cor={cor} />
        </View>
        <View style={estilos.textos}>
          <Texto style={[estilos.titulo, perigo && { color: colors.perigo }]}>{titulo}</Texto>
          {apoio && <Texto style={estilos.apoio}>{apoio}</Texto>}
        </View>
        {aoTocar && <Icone nome="seta" tamanho={16} cor={colors.textoTenue} />}
      </View>
    </Cartao>
  );
}

const estilos = StyleSheet.create({
  cartao: { padding: spacing.medio + 2, borderRadius: radius.cartao },
  cartaoPerigo: { borderColor: colors.perigoBorda },
  linha: { flexDirection: 'row', alignItems: 'center', gap: spacing.medio },
  moldura: {
    width: 38,
    height: 38,
    borderRadius: radius.medio,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textos: { flex: 1, gap: spacing.micro },
  titulo: {
    fontSize: typography.tamanho.corpo,
    fontWeight: typography.peso.forte,
    color: colors.texto,
  },
  apoio: {
    fontSize: typography.tamanho.mini + 0.5,
    color: colors.textoFraco,
    lineHeight: (typography.tamanho.mini + 0.5) * typography.altura.apertada,
  },
});
