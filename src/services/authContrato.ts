import type { DadosCadastro, Sessao, Usuario } from '../types/usuario';

export interface PedidoDeCodigo {
  email: string;
  expiraEmSegundos: number;
  /** Só existe no modo demonstração: com a API real o código sai por e-mail. */
  codigoParaDemonstracao?: string;
}

/** O que as telas de acesso usam; `authMock` e `authApi` implementam o mesmo contrato. */
export interface AuthService {
  entrar(email: string, senha: string): Promise<Sessao>;
  cadastrar(dados: DadosCadastro): Promise<Sessao>;
  pedirCodigo(email: string): Promise<PedidoDeCodigo>;
  conferirCodigo(email: string, codigo: string): Promise<void>;
  redefinirSenha(email: string, codigo: string, senha: string): Promise<void>;
  /** Encerra a sessão no servidor. Quem chama não deve depender do resultado. */
  sair(): Promise<void>;
  /** Devolve o usuário do token guardado, ou `null` se a sessão não vale mais. */
  restaurar(): Promise<Usuario | null>;
}

export interface PerfilService {
  carregar(): Promise<Usuario>;
  salvar(mudancas: Pick<Usuario, 'nome' | 'apelido' | 'email' | 'telefone'>): Promise<Usuario>;
  trocarSenha(senhaAtual: string, novaSenha: string): Promise<void>;
  excluirConta(confirmacao: string, senha: string): Promise<void>;
}
