import { StyleSheet, View } from 'react-native';
import { Texto } from './Texto';
import { colors, radius, spacing, typography } from '../theme';
import { Icone, type NomeDeIcone } from './Icone';

export type TipoDeAviso = 'erro' | 'sucesso' | 'informacao';

const VISUAL: Record<
  TipoDeAviso,
  { fundo: string; borda: string; texto: string; icone: NomeDeIcone }
> = {
  erro: {
    fundo: colors.perigoFundoSuave,
    borda: colors.perigoBorda,
    texto: colors.perigo,
    icone: 'circulo',
  },
  sucesso: {
    fundo: colors.sucessoFundo,
    borda: colors.sucessoFundo,
    texto: colors.sucesso,
    icone: 'vistoCirculo',
  },
  informacao: {
    fundo: colors.primariaSuave,
    borda: colors.primariaBorda,
    texto: colors.textoMedio,
    icone: 'escudo',
  },
};

export interface AvisoProps {
  children?: string | null;
  tipo?: TipoDeAviso;
}

/**
 * Mensagem de estado. Não usa só a cor para comunicar: o ícone acompanha, como
 * pede o mínimo de acessibilidade em docs/DESIGN_SYSTEM.md.
 */
export function Aviso({ children, tipo = 'erro' }: AvisoProps) {
  if (!children) return null;
  const visual = VISUAL[tipo];
  return (
    <View
      accessibilityRole="alert"
      style={[estilos.caixa, { backgroundColor: visual.fundo, borderColor: visual.borda }]}
    >
      <Icone nome={visual.icone} tamanho={17} cor={visual.texto} traco={2.2} />
      <Texto style={[estilos.texto, { color: visual.texto }]}>{children}</Texto>
    </View>
  );
}

const estilos = StyleSheet.create({
  caixa: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.pequeno,
    borderWidth: 1,
    borderRadius: radius.cartao,
    padding: spacing.medio,
  },
  texto: {
    flex: 1,
    fontSize: typography.tamanho.pequena,
    lineHeight: typography.tamanho.pequena * typography.altura.normal,
    fontWeight: typography.peso.semi,
  },
});
