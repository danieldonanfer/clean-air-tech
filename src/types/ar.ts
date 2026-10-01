/** Tipos do domínio de qualidade do ar, compartilhados entre features. */

/** Valores brutos dos sensores num instante. */
export interface ValoresSensores {
  /** Material particulado fino, em µg/m³. */
  pm25: number;
  /** Material particulado inalável, em µg/m³. */
  pm10: number;
  /** Dióxido de carbono, em ppm. */
  co2: number;
  /** Compostos orgânicos voláteis, em mg/m³. */
  covs: number;
  /** Temperatura do ambiente, em °C. */
  temperatura: number;
  /** Umidade relativa, em %. */
  umidade: number;
}

/** Uma leitura completa, já com o índice calculado. */
export interface Leitura extends ValoresSensores {
  iqa: number;
  /** Instante da leitura em ISO 8601. */
  instante: string;
}

/** Faixa de classificação do índice. */
export interface FaixaIQA {
  rotulo: string;
  cor: string;
  fundo: string;
  texto: string;
}

/** Um ponto da faixa de horas do painel. */
export interface PontoDoDia {
  rotulo: string;
  iqa: number;
  /** Hora ainda não alcançada: a projeção aparece esmaecida. */
  futuro: boolean;
}

/** Um ponto do histórico (um dia, uma amostra ou um mês, conforme o período). */
export interface PontoHistorico extends ValoresSensores {
  iqa: number;
  rotulo: string;
  /** Chave da amostra: AAAA-MM-DD, ou AAAA-MM no período de 90 dias. */
  data: string;
}

export type PeriodoHistorico = '7d' | '30d' | '90d';

export interface Historico {
  periodo: PeriodoHistorico;
  pontos: PontoHistorico[];
  resumo: {
    media: number;
    pior: PontoHistorico;
    melhor: PontoHistorico;
  };
}

export interface Dispositivo {
  nome: string;
  comodo: string;
  serie: string;
  firmware: string;
  bateria: number;
  rede: string;
  filtro: { vidaRestante: number; trocarEm: string };
}
