import { faixasIQA } from '../theme';
import type { FaixaIQA, ValoresSensores } from '../types/ar';

/**
 * Limites de referência de cada poluente. O de PM2.5 é o da OMS (15 µg/m³);
 * 400 ppm é o CO₂ do ar livre e 1000 ppm o ponto em que já incomoda; 0,50 mg/m³
 * é o teto de conforto para COVs.
 */
const REFERENCIA = {
  pm25: 15,
  co2: { arLivre: 400, teto: 1000 },
  covs: 0.5,
} as const;

/** Limita um índice ao intervalo válido de 0 a 500. */
export function limitarIQA(valor: number): number {
  return Math.min(500, Math.max(0, Math.round(valor)));
}

/**
 * Calcula o índice a partir dos poluentes.
 *
 * Cada poluente vira uma nota conforme o quanto ocupa do seu limite
 * recomendado, e o índice é a **pior** das notas — não a média delas. É assim
 * que os índices de qualidade do ar reais funcionam: quem manda é o poluente
 * mais crítico, porque uma média esconderia um pico perigoso de um só gás.
 */
export function calcularIQA({
  pm25,
  co2,
  covs,
}: Pick<ValoresSensores, 'pm25' | 'co2' | 'covs'>): number {
  const notaPM = (pm25 / REFERENCIA.pm25) * 50;
  const notaCO2 =
    ((co2 - REFERENCIA.co2.arLivre) / (REFERENCIA.co2.teto - REFERENCIA.co2.arLivre)) * 50;
  const notaCOV = (covs / REFERENCIA.covs) * 50;
  return limitarIQA(Math.max(notaPM, notaCO2, notaCOV));
}

/**
 * Classifica um índice numa das faixas do tema. Nenhuma tela deve comparar o
 * número com limites por conta própria — trocar a escala é mexer só em
 * src/theme/colors.ts.
 */
export function classificarIQA(valor: number): FaixaIQA {
  const faixa = faixasIQA.find((f) => valor <= f.ate) ?? faixasIQA[faixasIQA.length - 1];
  return { rotulo: faixa.rotulo, cor: faixa.cor, fundo: faixa.fundo, texto: faixa.texto };
}
