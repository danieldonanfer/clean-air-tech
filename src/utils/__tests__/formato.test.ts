import { telefoneParaExibicao } from '../formato';

describe('telefoneParaExibicao', () => {
  it('formata celular e fixo do Brasil', () => {
    expect(telefoneParaExibicao('+5511987654321')).toBe('+55 (11) 98765-4321');
    expect(telefoneParaExibicao('+551133334444')).toBe('+55 (11) 3333-4444');
  });

  it('devolve como veio o que não for número brasileiro em E.164', () => {
    expect(telefoneParaExibicao('+14155550100')).toBe('+14155550100');
    expect(telefoneParaExibicao('')).toBe('');
  });
});
