/**
 * Plus Jakarta Sans, a fonte do protótipo. Cada peso é um arquivo (família)
 * separado: nas plataformas nativas o `fontWeight` não escolhe o peso de uma fonte
 * customizada, então o `Texto` traduz o peso do estilo para a família abaixo. Os
 * nomes são os exportados por `@expo-google-fonts/plus-jakarta-sans`, carregados
 * em src/app/_layout.tsx.
 */
const familias = {
  '400': 'PlusJakartaSans_400Regular',
  '500': 'PlusJakartaSans_500Medium',
  '600': 'PlusJakartaSans_600SemiBold',
  '700': 'PlusJakartaSans_700Bold',
  '800': 'PlusJakartaSans_800ExtraBold',
} as const;

/** Família correspondente a um `fontWeight`; peso desconhecido cai no regular. */
export function familiaDoPeso(peso?: string | number): string {
  const chave = String(peso ?? '400');
  return familias[chave as keyof typeof familias] ?? familias['400'];
}

/**
 * Escala tipográfica. Nenhuma tela declara `fontFamily` por conta própria: os
 * estilos só dizem o `fontWeight` (de `peso`) e o `Texto` resolve a família.
 */
export const typography = {
  familias,

  tamanho: {
    micro: 10.5,
    mini: 11,
    minuscula: 12,
    pequena: 12.5,
    apoio: 13,
    corpo: 13.5,
    corpoGrande: 14,
    destaque: 15,
    titulo: 16,
    tituloGrande: 18,
    cabecalho: 22,
    numeroMedio: 24,
    cabecalhoGrande: 26,
    numero: 34,
    numeroGrande: 52,
  },

  peso: {
    normal: '400',
    medio: '500',
    semi: '600',
    forte: '700',
    extra: '800',
  },

  altura: {
    apertada: 1.25,
    normal: 1.45,
    solta: 1.6,
  },
} as const;
