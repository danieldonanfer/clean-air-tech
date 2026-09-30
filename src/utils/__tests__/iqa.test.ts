import { calcularIQA, classificarIQA, limitarIQA } from '../iqa';

describe('limitarIQA', () => {
  it('limita valores acima de 500', () => {
    expect(limitarIQA(900)).toBe(500);
  });

  it('limita valores negativos a 0', () => {
    expect(limitarIQA(-10)).toBe(0);
  });

  it('arredonda valores fracionários dentro do intervalo', () => {
    expect(limitarIQA(123.6)).toBe(124);
  });
});

describe('calcularIQA', () => {
  it('vale a pior nota, não a média das notas', () => {
    // PM2.5 e COVs ótimos, CO₂ no teto: o índice tem que refletir o CO₂.
    const indice = calcularIQA({ pm25: 1, co2: 1000, covs: 0.01 });
    expect(indice).toBe(50);
  });

  it('trata 400 ppm de CO₂ como ar livre, sem penalizar', () => {
    expect(calcularIQA({ pm25: 0, co2: 400, covs: 0 })).toBe(0);
  });

  it('passa de 50 quando o poluente ultrapassa o limite de referência', () => {
    // 30 µg/m³ é o dobro do limite da OMS para PM2.5.
    expect(calcularIQA({ pm25: 30, co2: 400, covs: 0 })).toBe(100);
  });

  it('ignora um poluente bom quando outro está crítico', () => {
    const soCovs = calcularIQA({ pm25: 1, co2: 400, covs: 1.5 });
    expect(soCovs).toBeGreaterThan(100);
  });
});

describe('classificarIQA', () => {
  it('classifica o limite de cada faixa pelo valor de cima', () => {
    const esperado: [number, string][] = [
      [0, 'Excelente'],
      [50, 'Excelente'],
      [51, 'Moderado'],
      [100, 'Moderado'],
      [101, 'Atenção'],
      [150, 'Atenção'],
      [151, 'Ruim'],
      [200, 'Ruim'],
      [201, 'Muito ruim'],
      [300, 'Muito ruim'],
      [301, 'Perigoso'],
      [500, 'Perigoso'],
    ];
    for (const [valor, rotulo] of esperado) {
      expect([valor, classificarIQA(valor).rotulo]).toEqual([valor, rotulo]);
    }
  });

  it('usa uma cor de traço diferente em cada uma das seis faixas', () => {
    const cores = [25, 75, 125, 175, 250, 400].map((v) => classificarIQA(v).cor);
    expect(new Set(cores).size).toBe(6);
  });

  it('devolve cor de traço, de fundo e de texto para a faixa', () => {
    const faixa = classificarIQA(42);
    expect(faixa.cor).toMatch(/^#/);
    expect(faixa.fundo).toMatch(/^#/);
    expect(faixa.texto).toMatch(/^#/);
  });

  it('não devolve indefinido nem para um índice absurdo', () => {
    expect(classificarIQA(9999).rotulo).toBe('Perigoso');
  });
});
