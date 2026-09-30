/**
 * Simulação das leituras dos sensores.
 *
 * Enquanto o aparelho físico e o back-end não existem, a camada de serviços
 * precisa devolver números que se comportem como o ambiente real se comporta.
 * Um valor sorteado a esmo não serve: o gráfico fica com dentes aleatórios e
 * não conta história nenhuma.
 *
 * O modelo tem três camadas somadas:
 *   1. um valor de base, tirado das leituras típicas de um cômodo ventilado;
 *   2. um ciclo diário — o CO₂ sobe quando tem gente no cômodo e a temperatura
 *      acompanha o sol;
 *   3. um ruído suave e determinístico, para o valor nunca repetir exatamente,
 *      mas também não pular de um extremo ao outro entre duas leituras.
 *
 * Determinístico importa: pedindo o histórico duas vezes, vem o mesmo
 * histórico. Este arquivo é substituído pela integração real com o back-end sem
 * que nenhuma tela mude (ver docs/ARQUITETURA.md).
 */
import { calcularIQA } from '../utils/iqa';
import type {
  Historico,
  Leitura,
  PeriodoHistorico,
  PontoDoDia,
  PontoHistorico,
  ValoresSensores,
} from '../types/ar';

const BASE = {
  pm25: 9,
  pm10: 16,
  co2: 560,
  covs: 0.07,
  temperatura: 23,
  umidade: 48,
} as const;

/**
 * Gerador pseudoaleatório com semente (mulberry32). Mesma semente, mesma
 * sequência — é por isso que o histórico não muda a cada recarregamento.
 */
function geradorComSemente(semente: number): () => number {
  let a = semente >>> 0;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Ruído suave: interpola entre dois sorteios vizinhos em vez de pular. */
function ruidoSuave(semente: number, posicao: number): number {
  const inteiro = Math.floor(posicao);
  const fracao = posicao - inteiro;
  const a = geradorComSemente(semente + inteiro * 7919)();
  const b = geradorComSemente(semente + (inteiro + 1) * 7919)();
  const suave = fracao * fracao * (3 - 2 * fracao); // curva suave, sem quina
  return a + (b - a) * suave;
}

/**
 * Quanto o cômodo está ocupado ao longo do dia, de 0 a 1. Dois picos: a manhã
 * de trabalho e o começo da noite.
 */
function ocupacao(hora: number): number {
  const manha = Math.exp(-Math.pow((hora - 9.5) / 1.8, 2));
  const noite = Math.exp(-Math.pow((hora - 20) / 2.2, 2));
  return Math.min(1, manha + noite * 0.9);
}

/** Uma leitura completa num instante qualquer. */
export function leituraEm(data: Date = new Date()): Leitura {
  const hora = data.getHours() + data.getMinutes() / 60;
  const inicioDoAno = new Date(data.getFullYear(), 0, 0).getTime();
  const diaDoAno = Math.floor((data.getTime() - inicioDoAno) / 86400000);
  const posicao = diaDoAno + hora / 24;
  const pessoas = ocupacao(hora);

  const pm25 = BASE.pm25 + pessoas * 4 + (ruidoSuave(11, posicao * 8) - 0.5) * 5;
  const pm10 = BASE.pm10 + pessoas * 6 + (ruidoSuave(22, posicao * 8) - 0.5) * 8;
  const co2 = BASE.co2 + pessoas * 380 + (ruidoSuave(33, posicao * 12) - 0.5) * 90;
  const covs = BASE.covs + pessoas * 0.05 + (ruidoSuave(44, posicao * 6) - 0.5) * 0.04;

  // Mais fria de madrugada, mais quente no meio da tarde.
  const cicloTermico = Math.sin(((hora - 9) / 24) * 2 * Math.PI);
  const temperatura =
    BASE.temperatura + cicloTermico * 2.5 + (ruidoSuave(55, posicao * 4) - 0.5) * 1.2;
  const umidade = BASE.umidade - cicloTermico * 6 + (ruidoSuave(66, posicao * 4) - 0.5) * 6;

  const valores: ValoresSensores = {
    pm25: Math.max(1, Number(pm25.toFixed(1))),
    pm10: Math.max(2, Number(pm10.toFixed(1))),
    co2: Math.max(400, Math.round(co2)),
    covs: Math.max(0.01, Number(covs.toFixed(2))),
    temperatura: Number(temperatura.toFixed(1)),
    umidade: Math.round(Math.min(95, Math.max(20, umidade))),
  };

  return { ...valores, iqa: calcularIQA(valores), instante: data.toISOString() };
}

function mediaDe(amostras: ValoresSensores[]): ValoresSensores & { iqa: number } {
  const media = (campo: keyof ValoresSensores) =>
    amostras.reduce((s, a) => s + a[campo], 0) / amostras.length;

  const valores: ValoresSensores = {
    pm25: Number(media('pm25').toFixed(1)),
    pm10: Number(media('pm10').toFixed(1)),
    co2: Math.round(media('co2')),
    covs: Number(media('covs').toFixed(2)),
    temperatura: Number(media('temperatura').toFixed(1)),
    umidade: Math.round(media('umidade')),
  };
  return { ...valores, iqa: calcularIQA(valores) };
}

/** Média de um dia inteiro, amostrando de hora em hora. */
export function mediaDoDia(data: Date): ValoresSensores & { iqa: number } {
  const amostras: Leitura[] = [];
  for (let h = 0; h < 24; h += 1) {
    const d = new Date(data);
    d.setHours(h, 0, 0, 0);
    amostras.push(leituraEm(d));
  }
  return mediaDe(amostras);
}

/** As leituras de hoje, de duas em duas horas, para a faixa do painel. */
export function leiturasDoDia(agora: Date = new Date()): PontoDoDia[] {
  const pontos: PontoDoDia[] = [];
  for (let h = 9; h <= 19; h += 2) {
    const d = new Date(agora);
    d.setHours(h, 0, 0, 0);
    pontos.push({
      rotulo: `${String(h).padStart(2, '0')}h`,
      iqa: leituraEm(d).iqa,
      futuro: h > agora.getHours(),
    });
  }
  return pontos;
}

const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

/**
 * Histórico agrupado por período. Cada período agrupa de um jeito diferente,
 * como um aplicativo de previsão do tempo faz: 7 dias mostra dia a dia, 30 dias
 * amostra de cinco em cinco e 90 dias agrupa por mês de calendário — senão os
 * rótulos repetiriam o mesmo mês.
 */
export function historico(periodo: PeriodoHistorico = '7d', agora: Date = new Date()): Historico {
  const pontos: PontoHistorico[] = [];

  if (periodo === '90d') {
    for (let m = 2; m >= 0; m -= 1) {
      const referencia = new Date(agora.getFullYear(), agora.getMonth() - m, 15, 12, 0, 0);
      const amostras: (ValoresSensores & { iqa: number })[] = [];
      for (let dia = 3; dia <= 27; dia += 6) {
        const d = new Date(referencia.getFullYear(), referencia.getMonth(), dia, 12, 0, 0);
        if (d <= agora) amostras.push(mediaDoDia(d));
      }
      if (amostras.length === 0) amostras.push(mediaDoDia(referencia));
      pontos.push({
        rotulo: `${MESES[referencia.getMonth()]}/${referencia.getFullYear()}`,
        data: referencia.toISOString().slice(0, 7),
        ...mediaDe(amostras),
      });
    }
  } else {
    const config = periodo === '30d' ? { dias: 30, passo: 5 } : { dias: 7, passo: 1 };
    for (let i = config.dias - 1; i >= 0; i -= config.passo) {
      const d = new Date(agora);
      d.setDate(d.getDate() - i);
      d.setHours(12, 0, 0, 0);
      pontos.push({
        rotulo: periodo === '30d' ? String(d.getDate()).padStart(2, '0') : DIAS_SEMANA[d.getDay()],
        data: d.toISOString().slice(0, 10),
        ...mediaDoDia(d),
      });
    }
  }

  const iqas = pontos.map((p) => p.iqa);
  return {
    periodo,
    pontos,
    resumo: {
      media: Math.round(iqas.reduce((s, v) => s + v, 0) / iqas.length),
      pior: pontos.reduce((a, b) => (b.iqa > a.iqa ? b : a)),
      melhor: pontos.reduce((a, b) => (b.iqa < a.iqa ? b : a)),
    },
  };
}
