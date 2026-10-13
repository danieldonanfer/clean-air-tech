/** Perfil simulado (modo demonstração), com o mesmo contrato de `perfilApi.ts`. */
import { avaliarSenha } from '../utils/senha';
import type { PerfilService } from './authContrato';
import * as conta from './contaLocal';
import { ErroDeRegra } from './erros';
import { espera } from './latencia';

export const perfilMock: PerfilService = {
  async carregar() {
    await espera(200);
    return conta.lerUsuario();
  },

  async salvar(mudancas) {
    await espera();
    if (!mudancas.nome.trim()) throw new ErroDeRegra('O nome não pode ficar vazio.');
    if (!mudancas.email.includes('@')) throw new ErroDeRegra('Informe um e-mail válido.');
    return conta.salvarUsuario(mudancas);
  },

  async trocarSenha(senhaAtual, novaSenha) {
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
  async excluirConta(confirmacao, senha) {
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
