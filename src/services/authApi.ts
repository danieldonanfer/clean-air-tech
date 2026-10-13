/** Autenticação pela API real (contrato: clean-air-tech-api/docs/API_CONTRATO.md). */
import type { Sessao, Usuario } from '../types/usuario';
import { telefoneParaExibicao } from '../utils/formato';
import type { AuthService } from './authContrato';
import { ErroDeRegra } from './erros';
import { chamar } from './http';

/** Usuário como a API devolve; o telefone vem em E.164. */
export interface UsuarioDaApi extends Omit<Usuario, 'telefone'> {
  telefone: string;
}

export function paraUsuario(dto: UsuarioDaApi): Usuario {
  return { ...dto, telefone: telefoneParaExibicao(dto.telefone) };
}

interface RespostaDeSessao {
  token: string;
  usuario: UsuarioDaApi;
}

function paraSessao(r: RespostaDeSessao): Sessao {
  return { token: r.token, usuario: paraUsuario(r.usuario) };
}

export const authApi: AuthService = {
  async entrar(email, senha) {
    const r = await chamar<RespostaDeSessao>('POST', '/v1/auth/login', {
      corpo: { email: email.trim(), senha },
      autenticado: false,
    });
    return paraSessao(r);
  },

  async cadastrar(dados) {
    const telefone = dados.telefone.trim();
    const r = await chamar<RespostaDeSessao>('POST', '/v1/auth/cadastro', {
      corpo: {
        nome: dados.nome.trim(),
        email: dados.email.trim(),
        ...(telefone ? { telefone } : {}),
        senha: dados.senha,
        objetivo: dados.objetivo,
        aceitouTermos: dados.aceitouTermos,
      },
      autenticado: false,
    });
    return paraSessao(r);
  },

  async pedirCodigo(email) {
    const r = await chamar<{ expiraEmSegundos: number }>('POST', '/v1/auth/recuperacao/solicitar', {
      corpo: { email: email.trim() },
      autenticado: false,
    });
    return { email: email.trim(), expiraEmSegundos: r.expiraEmSegundos };
  },

  async conferirCodigo(email, codigo) {
    await chamar('POST', '/v1/auth/recuperacao/conferir', {
      corpo: { email: email.trim(), codigo: codigo.trim() },
      autenticado: false,
    });
  },

  async redefinirSenha(email, codigo, senha) {
    await chamar('POST', '/v1/auth/recuperacao/redefinir', {
      corpo: { email: email.trim(), codigo: codigo.trim(), senha },
      autenticado: false,
    });
  },

  async sair() {
    await chamar('POST', '/v1/auth/logout');
  },

  async restaurar() {
    try {
      const r = await chamar<{ usuario: UsuarioDaApi }>('GET', '/v1/auth/eu');
      return paraUsuario(r.usuario);
    } catch (e) {
      if (e instanceof ErroDeRegra && e.codigo === 'SESSAO_INVALIDA') return null;
      throw e;
    }
  },
};
