import { avaliarSenha, rotuloDaForca, REGRAS_SENHA } from '../senha';

describe('avaliarSenha', () => {
  it('reprova senha vazia em todas as regras', () => {
    const { forca, valida, regras } = avaliarSenha('');
    expect(forca).toBe(0);
    expect(valida).toBe(false);
    expect(regras.every((r) => !r.ok)).toBe(true);
  });

  it('aprova a senha da conta de demonstração', () => {
    expect(avaliarSenha('Purifica@2025').valida).toBe(true);
  });

  it('reprova quando falta só o caractere especial', () => {
    const { valida, regras } = avaliarSenha('Purifica2025');
    expect(valida).toBe(false);
    expect(regras.find((r) => r.chave === 'especial')?.ok).toBe(false);
    expect(regras.find((r) => r.chave === 'numero')?.ok).toBe(true);
  });

  it('reprova senha de 7 caracteres mesmo atendendo o resto', () => {
    expect(avaliarSenha('Ab1@cde').valida).toBe(false);
  });

  it('conta a força como o número de regras atendidas', () => {
    expect(avaliarSenha('abcdefgh').forca).toBe(1);
    expect(avaliarSenha('Abcdefgh').forca).toBe(2);
    expect(avaliarSenha('Abcdefg1').forca).toBe(3);
    expect(avaliarSenha('Abcdefg1@').forca).toBe(REGRAS_SENHA.length);
  });
});

describe('rotuloDaForca', () => {
  it('nomeia cada nível de força', () => {
    expect(rotuloDaForca(0)).toBe('Muito fraca');
    expect(rotuloDaForca(4)).toBe('Forte e segura');
  });

  it('cai no primeiro rótulo para um valor fora da escala', () => {
    expect(rotuloDaForca(99)).toBe('Muito fraca');
  });
});
