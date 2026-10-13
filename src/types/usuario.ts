/** Tipos da conta do usuário. */
import type { ChaveObjetivo } from '../utils/objetivos';

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
  /** Chave do objetivo escolhido (ver `utils/objetivos.ts`), não o texto. */
  objetivo: ChaveObjetivo;
  aceitouTermos: boolean;
}
