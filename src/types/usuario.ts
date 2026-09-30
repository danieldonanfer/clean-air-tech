/** Tipos da conta do usuário. */

export interface Usuario {
  nome: string;
  apelido: string;
  email: string;
  telefone: string;
  funcao: string;
  idioma: string;
  membroDesde: string;
  objetivo: string;
}

export interface Sessao {
  token: string;
  usuario: Usuario;
}

export interface DadosCadastro {
  nome: string;
  email: string;
  telefone: string;
  senha: string;
  objetivo: string;
  aceitouTermos: boolean;
}
