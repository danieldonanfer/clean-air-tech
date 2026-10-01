/**
 * Paleta do projeto. Os valores vieram do protótipo no Figma — nenhuma tela ou
 * componente deve escrever hexadecimal solto (ver docs/DESIGN_SYSTEM.md).
 */
export const colors = {
  // marca
  primaria: '#0EA5E9',
  primariaEscura: '#0369A1',
  primariaProfunda: '#006591',
  primariaSuave: '#EFF8FF',
  primariaSuaveAlt: '#E3F2FD',
  primariaBorda: '#D6EBFB',

  // texto
  texto: '#0F172A',
  textoMedio: '#475569',
  textoForte: '#334155',
  textoApoio: '#64748B',
  textoFraco: '#94A3B8',
  textoTenue: '#CBD5E1',

  // superfícies
  fundo: '#F2F2F7',
  fundoAlt: '#F8FAFC',
  cartao: '#FFFFFF',
  borda: '#E2E8F0',
  bordaClara: '#F1F5F9',
  bordaCartao: '#EDF0F5',

  // estados
  sucesso: '#15803D',
  sucessoForte: '#22C55E',
  sucessoFundo: '#DCFCE7',
  atencao: '#B45309',
  atencaoForte: '#F59E0B',
  atencaoFundo: '#FEF3C7',
  perigo: '#B3261E',
  perigoFundo: '#FFDAD6',
  perigoFundoSuave: '#FFF1F0',
  perigoBorda: '#FBE3E1',

  // utilitários
  transparente: 'transparent',
  sombra: 'rgba(15, 23, 42, 0.18)',
  veu: 'rgba(15, 23, 42, 0.45)',
} as const;

/**
 * Faixas do Índice de Qualidade do Ar, na escala de seis níveis usada pelo
 * mercado (verde/amarelo/laranja/vermelho/roxo/marrom, como IQAir e Awair) e
 * pedida em docs/DESIGN_SYSTEM.md. Os limites são os da escala da EPA.
 *
 * `cor` é o traço (anel, barras), `fundo` a pílula e `texto` a cor do rótulo
 * sobre fundo claro. As três respeitam contraste AA; o nível nunca depende só da
 * cor, porque o rótulo sempre acompanha. Trocar a escala é mexer **só aqui**:
 * quem consome usa `classificarIQA()` em src/utils/iqa.ts e não conhece os limites.
 */
export const faixasIQA = [
  {
    ate: 50,
    rotulo: 'Excelente',
    cor: colors.sucessoForte,
    fundo: colors.sucessoFundo,
    texto: colors.sucesso,
  },
  {
    ate: 100,
    rotulo: 'Moderado',
    cor: '#EAB308',
    fundo: '#FEF9C3',
    texto: '#854D0E',
  },
  {
    ate: 150,
    rotulo: 'Atenção',
    cor: '#F97316',
    fundo: '#FFEDD5',
    texto: '#C2410C',
  },
  {
    ate: 200,
    rotulo: 'Ruim',
    cor: '#F04438',
    fundo: '#FEE2E2',
    texto: '#B42318',
  },
  {
    ate: 300,
    rotulo: 'Muito ruim',
    cor: '#8B5CF6',
    fundo: '#EDE9FE',
    texto: '#6D28D9',
  },
  {
    ate: Number.POSITIVE_INFINITY,
    rotulo: 'Perigoso',
    cor: '#7C2D12',
    fundo: '#F5E6DC',
    texto: '#7C2D12',
  },
] as const;
