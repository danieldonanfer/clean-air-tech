/**
 * Objetivos de uso do cadastro. A chave é o que vai para a API; o texto é o que o
 * usuário lê (a API devolve o texto no campo `objetivo` do usuário).
 */
export const TEXTO_OBJETIVO = {
  ar: 'Monitoramento de ar e poluentes',
  alergia: 'Controle de alergias e asma',
  conforto: 'Conforto e automação',
  outro: 'Outro objetivo',
} as const;

export type ChaveObjetivo = keyof typeof TEXTO_OBJETIVO;
