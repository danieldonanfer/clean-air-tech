import { useWindowDimensions } from 'react-native';
import { larguraAmpla } from '../theme';

export type FormatoDeTela = 'compacto' | 'amplo';

/**
 * Diz se a tela cabe numa coluna de polegar ou se comporta duas colunas. É o
 * que permite o mesmo código servir celular, tablet e web, em vez de manter uma
 * versão por plataforma (ver docs/ARQUITETURA.md).
 */
export function useLarguraDaTela(): { formato: FormatoDeTela; amplo: boolean; largura: number } {
  const { width } = useWindowDimensions();
  const amplo = width >= larguraAmpla;
  return { formato: amplo ? 'amplo' : 'compacto', amplo, largura: width };
}
