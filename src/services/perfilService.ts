/** Dados pessoais, troca de senha e exclusão da conta. */
import type { Usuario } from '../types/usuario';
import { avaliarSenha } from '../utils/senha';
import { ErroDeRegra } from './authService';
import * as conta from './contaLocal';
import { espera } from './latencia';

type CamposEditaveis = Pick<Usuario, 'nome' | 'apelido' | 'email' | 'telefone'>;

export const perfilService = {
  async carregar(): Promise<Usuario> {
    await espera(200);
    return conta.lerUsuario();
  },

  async salvar(mudancas: CamposEditaveis): Promise<Usuario> {
    await espera();
    if (!mudancas.nome.trim()) throw new ErroDeRegra('O nome não pode ficar vazio.');
    if (!mudancas.email.includes('@')) throw new ErroDeRegra('Informe um e-mail válido.');
    return conta.salvarUsuario(mudancas);
  },

  async trocarSenha(senhaAtual: string, novaSenha: string): Promise<void> {
    await espera();
    if (!conta.conferirSenha(conta.emailDaConta(), senhaAtual)) {
      throw new ErroDeRegra('A senha atual não confere.');
    }
    if (!avaliarSenha(novaSenha).valida) {
      throw new ErroDeRegra('A nova senha não atende aos requisitos.');
    }
    conta.trocarSenha(novaSenha);
  },

  /**
   * Exclusão exige confirmação dupla: a palavra EXCLUIR e a senha atual. Uma
   * ação irreversível não deve depender de um único toque.
   */
  async excluirConta(confirmacao: string, senha: string): Promise<void> {
    await espera(520);
    if (confirmacao.trim().toUpperCase() !== 'EXCLUIR') {
      throw new ErroDeRegra('Digite EXCLUIR para confirmar.');
    }
    if (!conta.conferirSenha(conta.emailDaConta(), senha)) {
      throw new ErroDeRegra('A senha não confere.');
    }
    conta.reiniciarConta();
  },
};
