/**
 * Regras de senha num lugar só: a tela de cadastro, a de redefinição e a de
 * troca leem daqui, então não tem como uma cobrar uma coisa e a outra cobrar
 * outra. Quando o back-end entrar, ele precisa repetir a mesma validação — o
 * front sozinho não basta, porque a API pode ser chamada direto.
 */
export interface RegraSenha {
  chave: string;
  rotulo: string;
  testar: (senha: string) => boolean;
}

export const REGRAS_SENHA: RegraSenha[] = [
  { chave: 'tamanho', rotulo: 'Mínimo de 8 caracteres', testar: (s) => s.length >= 8 },
  {
    chave: 'caixa',
    rotulo: 'Letra maiúscula e minúscula',
    testar: (s) => /[A-Z]/.test(s) && /[a-z]/.test(s),
  },
  { chave: 'numero', rotulo: 'Pelo menos um número', testar: (s) => /[0-9]/.test(s) },
  {
    chave: 'especial',
    rotulo: 'Um caractere especial (!@#$)',
    testar: (s) => /[^A-Za-z0-9]/.test(s),
  },
];

export interface AvaliacaoSenha {
  regras: { chave: string; rotulo: string; ok: boolean }[];
  forca: number;
  valida: boolean;
}

export function avaliarSenha(senha: string): AvaliacaoSenha {
  const regras = REGRAS_SENHA.map((r) => ({
    chave: r.chave,
    rotulo: r.rotulo,
    ok: r.testar(senha),
  }));
  const atendidas = regras.filter((r) => r.ok).length;
  return { regras, forca: atendidas, valida: atendidas === REGRAS_SENHA.length };
}

const ROTULOS_FORCA = ['Muito fraca', 'Fraca', 'Razoável', 'Boa', 'Forte e segura'];

export function rotuloDaForca(forca: number): string {
  return ROTULOS_FORCA[forca] ?? ROTULOS_FORCA[0];
}
