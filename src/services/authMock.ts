/**
 * Autenticação simulada (modo demonstração): usada quando `EXPO_PUBLIC_API_URL`
 * não está definida. Guarda tudo em memória (ver `contaLocal.ts`) e segue o mesmo
 * contrato de `authApi.ts`, para as telas não saberem a diferença.
 *
 * As mensagens de erro saem daqui e da API, não das telas — assim o texto que o
 * usuário lê é o mesmo em qualquer ponto do app.
 */
import type { DadosCadastro, Sessao, Usuario } from '../types/usuario';
import { TEXTO_OBJETIVO } from '../utils/objetivos';
import { avaliarSenha } from '../utils/senha';
import type { AuthService } from './authContrato';
import * as conta from './contaLocal';
import { ErroDeRegra } from './erros';
import { espera } from './latencia';

function novoToken(): string {
  return `sessao-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** A mesma checagem da tela, repetida aqui porque o serviço pode ser chamado sem ela. */
function exigirSenhaValida(senha: string): void {
  const avaliacao = avaliarSenha(senha);
  if (avaliacao.valida) return;
  const faltando = avaliacao.regras.find((r) => !r.ok);
  throw new ErroDeRegra(`A senha não atende a um requisito: ${faltando?.rotulo.toLowerCase()}.`);
}

export const authMock: AuthService = {
  async entrar(email, senha) {
    await espera();
    if (!conta.conferirSenha(email, senha)) {
      throw new ErroDeRegra('E-mail ou senha incorretos.');
    }
    return { token: novoToken(), usuario: conta.lerUsuario() };
  },

  async pedirCodigo(email) {
    await espera();
    const existe = email.trim().toLowerCase() === conta.emailDaConta().toLowerCase();
    // Como na API real, não revela se a conta existe: só a conta de demonstração
    // recebe um código (que aparece na tela, já que não há e-mail neste modo).
    return {
      email: email.trim(),
      expiraEmSegundos: conta.VALIDADE_CODIGO_MS / 1000,
      codigoParaDemonstracao: existe ? conta.gerarCodigo(email) : undefined,
    };
  },

  async conferirCodigo(email, codigo) {
    await espera();
    if (!conta.conferirCodigo(email, codigo)) {
      throw new ErroDeRegra('Código inválido ou expirado.');
    }
  },

  async redefinirSenha(email, codigo, senha) {
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
      objetivo: TEXTO_OBJETIVO[dados.objetivo],
      membroDesde: new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
    });
    conta.trocarSenha(dados.senha);
    return { token: novoToken(), usuario };
  },

  async sair() {
    // nada no servidor para encerrar
  },

  async restaurar() {
    return null;
  },
};
