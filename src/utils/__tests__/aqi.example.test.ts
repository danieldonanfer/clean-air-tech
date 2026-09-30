import { clampAqi } from '../aqi.example';

describe('clampAqi (exemplo de padrão de teste)', () => {
  it('limita valores acima de 500', () => {
    expect(clampAqi(900)).toBe(500);
  });

  it('limita valores negativos a 0', () => {
    expect(clampAqi(-10)).toBe(0);
  });

  it('arredonda valores fracionários dentro do intervalo', () => {
    expect(clampAqi(123.6)).toBe(124);
  });
});
