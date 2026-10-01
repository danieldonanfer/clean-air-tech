/**
 * Ícones do aplicativo, desenhados no mesmo padrão do protótipo no Figma: grade
 * de 24, traço 2, pontas arredondadas. Ter o conjunto aqui, em vez de uma fonte
 * de ícones pronta, é o que mantém a tela idêntica ao protótipo aprovado.
 */
import { Circle, G, Path, Rect, Svg } from 'react-native-svg';
import type { ReactElement } from 'react';
import type { ColorValue } from 'react-native';

export type NomeDeIcone =
  | 'marca'
  | 'email'
  | 'cadeado'
  | 'olho'
  | 'olhoFechado'
  | 'usuario'
  | 'voltar'
  | 'seta'
  | 'visto'
  | 'vistoCirculo'
  | 'circulo'
  | 'casa'
  | 'grafico'
  | 'aparelho'
  | 'engrenagem'
  | 'conversa'
  | 'escudo'
  | 'sino'
  | 'sair'
  | 'lixeira'
  | 'local'
  | 'compartilhar'
  | 'relogio'
  | 'enviar'
  | 'chave';

const CAMINHOS: Record<NomeDeIcone, ReactElement> = {
  marca: (
    <G>
      <Path d="M3 8h9a3 3 0 1 0-3-3" />
      <Path d="M3 13h13a3.5 3.5 0 1 1-3.5 3.5" />
      <Path d="M3 18h6" />
    </G>
  ),
  email: (
    <G>
      <Rect x="3" y="5" width="18" height="14" rx="2.5" />
      <Path d="m3.5 6.5 8.5 6 8.5-6" />
    </G>
  ),
  cadeado: (
    <G>
      <Rect x="4" y="10" width="16" height="11" rx="2.5" />
      <Path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </G>
  ),
  olho: (
    <G>
      <Path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z" />
      <Circle cx="12" cy="12" r="2.8" />
    </G>
  ),
  olhoFechado: (
    <G>
      <Path d="M3 3l18 18" />
      <Path d="M10.6 6.1A9.9 9.9 0 0 1 12 6c6.4 0 10 6 10 6a17 17 0 0 1-3.2 3.9M6.6 6.7A17 17 0 0 0 2 12s3.6 6 10 6a9.7 9.7 0 0 0 3.5-.6" />
    </G>
  ),
  usuario: (
    <G>
      <Circle cx="12" cy="8" r="4" />
      <Path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" />
    </G>
  ),
  voltar: <Path d="M15 18l-6-6 6-6" />,
  seta: <Path d="M9 6l6 6-6 6" />,
  visto: <Path d="M20 6 9 17l-5-5" />,
  vistoCirculo: (
    <G>
      <Circle cx="12" cy="12" r="9" />
      <Path d="M8.5 12.2l2.4 2.4 4.6-4.8" />
    </G>
  ),
  circulo: <Circle cx="12" cy="12" r="9" />,
  casa: (
    <G>
      <Path d="M3 10.5 12 3l9 7.5" />
      <Path d="M5.5 9.5V21h13V9.5" />
    </G>
  ),
  grafico: (
    <G>
      <Path d="M3 20V4" />
      <Path d="M3 20h18" />
      <Path d="M7 16v-5M12 16V8M17 16v-7" />
    </G>
  ),
  aparelho: (
    <G>
      <Rect x="4" y="3" width="16" height="18" rx="3" />
      <Path d="M9 18h6" />
    </G>
  ),
  engrenagem: (
    <G>
      <Circle cx="12" cy="12" r="3.2" />
      <Path d="M12 2.5v2.8M12 18.7v2.8M21.5 12h-2.8M5.3 12H2.5M18.7 5.3l-2 2M7.3 16.7l-2 2M18.7 18.7l-2-2M7.3 7.3l-2-2" />
    </G>
  ),
  conversa: <Path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
  escudo: (
    <G>
      <Path d="M12 22s8-3.5 8-10V5.5L12 2 4 5.5V12c0 6.5 8 10 8 10z" />
      <Path d="M9 12l2 2 4-4" />
    </G>
  ),
  sino: (
    <G>
      <Path d="M18 8.5a6 6 0 1 0-12 0c0 6-2.5 7.5-2.5 7.5h17S18 14.5 18 8.5z" />
      <Path d="M13.7 19.5a2 2 0 0 1-3.4 0" />
    </G>
  ),
  sair: (
    <G>
      <Path d="M14 20H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8" />
      <Path d="M17 15l4-3-4-3" />
      <Path d="M21 12H10" />
    </G>
  ),
  lixeira: (
    <G>
      <Path d="M3 6h18" />
      <Path d="M8 6V4h8v2" />
      <Path d="M6 6l1 14h10l1-14" />
      <Path d="M10 10v7M14 10v7" />
    </G>
  ),
  local: (
    <G>
      <Path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
      <Circle cx="12" cy="10" r="2.5" />
    </G>
  ),
  compartilhar: (
    <G>
      <Path d="M12 3v13" />
      <Path d="M8 7l4-4 4 4" />
      <Path d="M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" />
    </G>
  ),
  relogio: (
    <G>
      <Circle cx="12" cy="12" r="9" />
      <Path d="M12 7v5l3 2" />
    </G>
  ),
  enviar: (
    <G>
      <Path d="M21 3 3 10.5l7 3 3 7z" />
      <Path d="M10 13.5 21 3" />
    </G>
  ),
  chave: (
    <G>
      <Circle cx="8" cy="15" r="4" />
      <Path d="M11 12l9-9 2 2-2 2 2 2-2 2-2-2-2 2" />
    </G>
  ),
};

export interface IconeProps {
  nome: NomeDeIcone;
  tamanho?: number;
  cor?: ColorValue;
  traco?: number;
}

export function Icone({ nome, tamanho = 20, cor, traco = 2 }: IconeProps) {
  return (
    <Svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      fill="none"
      stroke={cor}
      strokeWidth={traco}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {CAMINHOS[nome]}
    </Svg>
  );
}
