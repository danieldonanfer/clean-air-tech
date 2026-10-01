import { historico, leiturasDoDia, leituraEm, mediaDoDia } from '../simulador';

/**
 * O que importa testar aqui não são os números exatos — eles mudam se o modelo
 * for ajustado — mas as propriedades de que as telas dependem: ser
 * determinístico, ficar dentro de faixas fisicamente plausíveis e agrupar o
 * período certo.
 */
const INSTANTE = new Date(2026, 8, 30, 14, 30, 0);

describe('leituraEm', () => {
  it('é determinística: a mesma data dá a mesma leitura', () => {
    expect(leituraEm(INSTANTE)).toEqual(leituraEm(new Date(INSTANTE)));
  });

  it('devolve valores dentro de faixas plausíveis', () => {
    const l = leituraEm(INSTANTE);
    expect(l.pm25).toBeGreaterThanOrEqual(1);
    expect(l.co2).toBeGreaterThanOrEqual(400);
    expect(l.covs).toBeGreaterThanOrEqual(0.01);
    expect(l.umidade).toBeGreaterThanOrEqual(20);
    expect(l.umidade).toBeLessThanOrEqual(95);
  });

  it('devolve um índice inteiro e não negativo', () => {
    const l = leituraEm(INSTANTE);
    expect(l.iqa).toBeGreaterThanOrEqual(0);
    expect(Number.isInteger(l.iqa)).toBe(true);
  });

  it('tem mais CO₂ no pico de ocupação do que de madrugada', () => {
    const madrugada = leituraEm(new Date(2026, 8, 30, 4, 0, 0));
    const manha = leituraEm(new Date(2026, 8, 30, 9, 30, 0));
    expect(manha.co2).toBeGreaterThan(madrugada.co2);
  });
});

describe('mediaDoDia', () => {
  it('é determinística', () => {
    expect(mediaDoDia(INSTANTE)).toEqual(mediaDoDia(new Date(INSTANTE)));
  });
});

describe('leiturasDoDia', () => {
  it('devolve as seis amostras de duas em duas horas', () => {
    const pontos = leiturasDoDia(INSTANTE);
    expect(pontos).toHaveLength(6);
    expect(pontos.map((p) => p.rotulo)).toEqual(['09h', '11h', '13h', '15h', '17h', '19h']);
  });

  it('marca como futuro só as horas que ainda não chegaram', () => {
    const pontos = leiturasDoDia(INSTANTE); // 14h30
    expect(pontos.filter((p) => !p.futuro).map((p) => p.rotulo)).toEqual(['09h', '11h', '13h']);
  });
});

describe('historico', () => {
  it('mostra 7 dias dia a dia', () => {
    expect(historico('7d', INSTANTE).pontos).toHaveLength(7);
  });

  it('amostra 30 dias de cinco em cinco', () => {
    expect(historico('30d', INSTANTE).pontos).toHaveLength(6);
  });

  it('agrupa 90 dias em três meses de calendário', () => {
    const { pontos } = historico('90d', INSTANTE);
    expect(pontos).toHaveLength(3);
    expect(new Set(pontos.map((p) => p.data)).size).toBe(3);
  });

  it('resume média, pior e melhor de forma coerente', () => {
    const { pontos, resumo } = historico('7d', INSTANTE);
    const iqas = pontos.map((p) => p.iqa);
    expect(resumo.pior.iqa).toBe(Math.max(...iqas));
    expect(resumo.melhor.iqa).toBe(Math.min(...iqas));
    expect(resumo.media).toBeGreaterThanOrEqual(resumo.melhor.iqa);
    expect(resumo.media).toBeLessThanOrEqual(resumo.pior.iqa);
  });

  it('é determinística', () => {
    expect(historico('7d', INSTANTE)).toEqual(historico('7d', new Date(INSTANTE)));
  });
});
