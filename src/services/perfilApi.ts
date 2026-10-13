/**
 * Perfil pela API real. Estas rotas são a "fase 2" do contrato: dependem de o
 * back-end tê-las implementado (GET/PATCH/DELETE /v1/perfil e POST /v1/perfil/senha).
 */
import type { PerfilService } from './authContrato';
import { paraUsuario, type UsuarioDaApi } from './authApi';
import { chamar } from './http';

export const perfilApi: PerfilService = {
  async carregar() {
    const r = await chamar<{ usuario: UsuarioDaApi }>('GET', '/v1/perfil');
    return paraUsuario(r.usuario);
  },

  async salvar(mudancas) {
    const r = await chamar<{ usuario: UsuarioDaApi }>('PATCH', '/v1/perfil', {
      corpo: {
        nome: mudancas.nome.trim(),
        apelido: mudancas.apelido.trim(),
        email: mudancas.email.trim(),
        telefone: mudancas.telefone.trim(),
      },
    });
    return paraUsuario(r.usuario);
  },

  async trocarSenha(senhaAtual, novaSenha) {
    await chamar('POST', '/v1/perfil/senha', { corpo: { senhaAtual, novaSenha } });
  },

  async excluirConta(confirmacao, senha) {
    await chamar('DELETE', '/v1/perfil', { corpo: { confirmacao: confirmacao.trim(), senha } });
  },
};
