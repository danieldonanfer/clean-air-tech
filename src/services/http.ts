/**
 * Cliente HTTP da API (contrato em clean-air-tech-api/docs/API_CONTRATO.md).
 *
 * Toda falha sai como `ErroDeRegra` com mensagem pronta para a tela, seja um erro
 * da API (`{ erro: { codigo, mensagem } }`), um servidor fora do ar ou a falta de
 * internet. Assim as telas só exibem `e.message`, como já faziam com o mock.
 */
import { API_URL } from './config';
import { ErroDeRegra } from './erros';

/** Folga para o plano gratuito de hospedagem, que "dorme" e leva ~30 s para acordar. */
const LIMITE_MS = 45_000;

let token: string | null = null;
let aoExpirar: (() => void) | null = null;

export function definirToken(novo: string | null): void {
  token = novo;
}

/** Registra o que fazer quando a API recusa o token (sessão expirada ou revogada). */
export function aoSessaoExpirar(callback: (() => void) | null): void {
  aoExpirar = callback;
}

interface Opcoes {
  corpo?: unknown;
  /** `false` nas rotas públicas (login, cadastro, recuperação): não envia o token. */
  autenticado?: boolean;
}

interface CorpoDeErro {
  erro?: { codigo?: string; mensagem?: string; campos?: Record<string, string> };
}

const MSG_SEM_REDE =
  'Não foi possível conectar ao servidor. Verifique sua conexão e tente de novo.';
const MSG_LENTO = 'O servidor demorou a responder. Tente novamente em instantes.';
const MSG_INDISPONIVEL = 'O servidor está indisponível no momento. Tente novamente em instantes.';

export async function chamar<T = void>(
  metodo: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  caminho: string,
  { corpo, autenticado = true }: Opcoes = {},
): Promise<T> {
  const controle = new AbortController();
  const relogio = setTimeout(() => controle.abort(), LIMITE_MS);
  const enviouToken = autenticado && token !== null;

  const cabecalhos: Record<string, string> = { Accept: 'application/json' };
  if (corpo !== undefined) cabecalhos['Content-Type'] = 'application/json';
  if (enviouToken) cabecalhos.Authorization = `Bearer ${token}`;

  let resposta: Response;
  try {
    resposta = await fetch(`${API_URL}${caminho}`, {
      method: metodo,
      headers: cabecalhos,
      body: corpo === undefined ? undefined : JSON.stringify(corpo),
      signal: controle.signal,
    });
  } catch (e) {
    throw new ErroDeRegra(e instanceof Error && e.name === 'AbortError' ? MSG_LENTO : MSG_SEM_REDE);
  } finally {
    clearTimeout(relogio);
  }

  if (resposta.ok) {
    if (resposta.status === 204) return undefined as T;
    return (await resposta.json()) as T;
  }

  let dados: CorpoDeErro | null = null;
  try {
    dados = (await resposta.json()) as CorpoDeErro;
  } catch {
    dados = null;
  }
  const erro = dados?.erro;
  if (!erro?.mensagem)
    throw new ErroDeRegra(MSG_INDISPONIVEL, { codigo: `HTTP_${resposta.status}` });

  if (erro.codigo === 'SESSAO_INVALIDA' && enviouToken) aoExpirar?.();
  throw new ErroDeRegra(erro.mensagem, { codigo: erro.codigo, campos: erro.campos });
}
