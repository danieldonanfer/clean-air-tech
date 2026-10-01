/**
 * Entrada, recuperação de senha e cadastro.
 *
 * As mensagens de erro saem daqui, não das telas — assim o texto que o usuário
 * lê é o mesmo em qualquer ponto do app, e a tela só precisa exibir o que veio.
 */
import type { DadosCadastro, Sessao, Usuario } from '../types/usuario';
import { avaliarSenha } from '../utils/senha';
import * as conta from './contaLocal';
import { espera } from './latencia';

/** Erro de regra de negócio: a mensagem já está pronta para a tela mostrar. */
export class ErroDeRegra extends Error {}

function novoToken(): string {
  return `sessao-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Repete no serviço a validação que a tela mostra ao usuário. Parece
 * redundante, mas não é: quando este mock der lugar à API real, a mesma
 * checagem precisa existir dos dois lados, porque a API pode ser chamada direto.
 */
function exigirSenhaValida(senha: string): void {
  const avaliacao = avaliarSenha(senha);
  if (avaliacao.valida) return;
  const faltando = avaliacao.regras.find((r) => !r.ok);
  throw new ErroDeRegra(`A senha não atende a um requisito: ${faltando?.rotulo.toLowerCase()}.`);
}

export interface PedidoDeCodigo {
  email: string;
  expiraEmSegundos: number;
  /** Só existe no mock: na API real o código sai por e-mail. */
  codigoParaDemonstracao: string;
}

export const authService = {
  async entrar(email: string, senha: string): Promise<Sessao> {
    await espera();
    if (!conta.conferirSenha(email, senha)) {
      throw new ErroDeRegra('E-mail ou senha incorretos.');
    }
    return { token: novoToken(), usuario: conta.lerUsuario() };
  },

  async pedirCodigo(email: string): Promise<PedidoDeCodigo> {
    await espera();
    if (email.trim().toLowerCase() !== conta.emailDaConta().toLowerCase()) {
      throw new ErroDeRegra('Não encontramos uma conta com esse e-mail.');
    }
    return {
      email: email.trim(),
      expiraEmSegundos: conta.VALIDADE_CODIGO_MS / 1000,
      codigoParaDemonstracao: conta.gerarCodigo(email),
    };
  },

  async conferirCodigo(email: string, codigo: string): Promise<void> {
    await espera();
    if (!conta.conferirCodigo(email, codigo)) {
      throw new ErroDeRegra('Código inválido ou expirado.');
    }
  },

  async redefinirSenha(email: string, codigo: string, senha: string): Promise<void> {
    await espera();
    if (!conta.conferirCodigo(email, codigo)) {
      throw new ErroDeRegra('Código inválido ou expirado.');
    }
    exigirSenhaValida(senha);
    conta.trocarSenha(senha);
  },

  async cadastrar(dados: DadosCadastro): Promise<Sessao> {
    await espera(420);
    if (!dados.nome.trim() || !dados.email.trim()) {
      throw new ErroDeRegra('Nome e e-mail são obrigatórios.');
    }
    if (!dados.aceitouTermos) {
      throw new ErroDeRegra('É preciso aceitar os Termos de Uso.');
    }
    exigirSenhaValida(dados.senha);

    const usuario: Usuario = conta.salvarUsuario({
      nome: dados.nome.trim(),
      apelido: dados.nome.trim().split(' ')[0],
      email: dados.email.trim(),
      telefone: dados.telefone.trim(),
      objetivo: dados.objetivo,
      membroDesde: new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
    });
    conta.trocarSenha(dados.senha);
    return { token: novoToken(), usuario };
  },
};
