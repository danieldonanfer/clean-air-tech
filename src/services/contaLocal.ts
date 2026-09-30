/**
 * Estado da conta enquanto o back-end não existe.
 *
 * Isto é a implementação **mock** da conta: guarda o usuário, a senha e os
 * códigos de recuperação em memória, só para o protótipo das telas poder ser
 * demonstrado de ponta a ponta. Quando o back-end (Node + TypeScript, em
 * repositório separado) entrar, este arquivo é o único que sai — os serviços que
 * o usam mantêm a mesma assinatura.
 *
 * A senha fica em texto na memória de propósito: guardar hash no cliente não
 * protege nada, e o hash de verdade é responsabilidade do servidor.
 */
import type { Usuario } from '../types/usuario';

export const CONTA_DEMONSTRACAO = {
  email: 'ana.silva@email.com',
  senha: 'Purifica@2025',
} as const;

const USUARIO_INICIAL: Usuario = {
  nome: 'Ana Silva',
  apelido: 'Ana',
  email: CONTA_DEMONSTRACAO.email,
  telefone: '+55 (11) 98765-4321',
  funcao: 'Administrador Residencial',
  idioma: 'Português (Brasil)',
  membroDesde: 'Março de 2023',
  objetivo: 'Monitoramento de ar e poluentes',
};

interface EstadoConta {
  usuario: Usuario;
  senha: string;
  codigos: Map<string, { codigo: string; expiraEm: number }>;
}

const estado: EstadoConta = {
  usuario: { ...USUARIO_INICIAL },
  senha: CONTA_DEMONSTRACAO.senha,
  codigos: new Map(),
};

/** Quanto tempo um código de recuperação vale, em milissegundos. */
export const VALIDADE_CODIGO_MS = 5 * 60 * 1000;

export function lerUsuario(): Usuario {
  return { ...estado.usuario };
}

export function salvarUsuario(mudancas: Partial<Usuario>): Usuario {
  estado.usuario = { ...estado.usuario, ...mudancas };
  return lerUsuario();
}

export function conferirSenha(email: string, senha: string): boolean {
  const emailBate = estado.usuario.email.trim().toLowerCase() === email.trim().toLowerCase();
  return emailBate && estado.senha === senha;
}

export function trocarSenha(senha: string): void {
  estado.senha = senha;
}

export function emailDaConta(): string {
  return estado.usuario.email;
}

/**
 * Gera o código de recuperação. Num sistema de verdade ele sairia por e-mail;
 * aqui volta na resposta, para a apresentação do TCC não depender de caixa de
 * entrada.
 */
export function gerarCodigo(email: string): string {
  const codigo = String(Math.floor(100000 + Math.random() * 900000));
  estado.codigos.set(email.trim().toLowerCase(), {
    codigo,
    expiraEm: Date.now() + VALIDADE_CODIGO_MS,
  });
  return codigo;
}

export function conferirCodigo(email: string, codigo: string): boolean {
  const registro = estado.codigos.get(email.trim().toLowerCase());
  if (!registro) return false;
  if (Date.now() > registro.expiraEm) {
    estado.codigos.delete(email.trim().toLowerCase());
    return false;
  }
  return registro.codigo === codigo.trim();
}

export function reiniciarConta(): void {
  estado.usuario = { ...USUARIO_INICIAL };
  estado.senha = CONTA_DEMONSTRACAO.senha;
  estado.codigos.clear();
}
