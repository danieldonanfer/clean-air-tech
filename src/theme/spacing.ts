/** Escala de espaçamento em múltiplos de 4. */
export const spacing = {
  nenhum: 0,
  micro: 2,
  mini: 4,
  pequeno: 8,
  medio: 12,
  padrao: 16,
  grande: 20,
  maior: 24,
  amplo: 32,
  enorme: 40,
} as const;

/** Raios de canto usados nos cartões, campos e pílulas. */
export const radius = {
  pequeno: 8,
  medio: 12,
  cartao: 14,
  painel: 18,
  grande: 24,
  pilula: 999,
} as const;

/**
 * Alvo mínimo de toque. 44 pontos é o mínimo recomendado pelas diretrizes de
 * acessibilidade da Apple e do Material — vale para botões e ícones clicáveis.
 */
export const alvoToqueMinimo = 44;

/**
 * Largura a partir da qual a tela deixa de ser "de polegar" e passa a usar duas
 * colunas. Mesmo código para celular, tablet e web (ver docs/ARQUITETURA.md).
 */
export const larguraAmpla = 900;
