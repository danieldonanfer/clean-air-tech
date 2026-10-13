/**
 * Sessão do usuário.
 *
 * Context API pura, de propósito: a biblioteca de estado global do projeto ainda
 * não foi escolhida (ver o fim de docs/ARQUITETURA.md). As telas usam
 * `useSessao()` e não sabem o que tem por baixo.
 *
 * Com a API real, o token fica guardado (ver `armazenamentoSessao.ts`): ao abrir o
 * app, ele é validado em `GET /v1/auth/eu` e a sessão volta sozinha. Enquanto isso
 * roda, `carregando` é `true` — quem decide a rota espera, para não mandar para o
 * login quem ainda tem sessão válida.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { apagarToken, lerToken, salvarToken } from '../services/armazenamentoSessao';
import { authService } from '../services/authService';
import { modoApi } from '../services/config';
import { aoSessaoExpirar, definirToken } from '../services/http';
import type { Sessao, Usuario } from '../types/usuario';

interface ValorSessao {
  sessao: Sessao | null;
  usuario: Usuario | null;
  /** `true` enquanto o app confere o token guardado. */
  carregando: boolean;
  entrar: (sessao: Sessao) => void;
  atualizarUsuario: (usuario: Usuario) => void;
  sair: () => void;
}

const Contexto = createContext<ValorSessao | null>(null);

export function ProvedorSessao({ children }: { children: ReactNode }) {
  const [sessao, setSessao] = useState<Sessao | null>(null);
  const [carregando, setCarregando] = useState(modoApi);

  const esquecer = useCallback(() => {
    definirToken(null);
    void apagarToken();
    setSessao(null);
  }, []);

  useEffect(() => {
    if (!modoApi) return;
    aoSessaoExpirar(esquecer);
    let ativo = true;
    (async () => {
      try {
        const guardado = await lerToken();
        if (!guardado) return;
        definirToken(guardado);
        const usuario = await authService.restaurar();
        if (!ativo) return;
        if (usuario) setSessao({ token: guardado, usuario });
        else esquecer();
      } catch {
        // API fora do ar: não derruba um token que pode estar válido, só não restaura agora
        definirToken(null);
      } finally {
        if (ativo) setCarregando(false);
      }
    })();
    return () => {
      ativo = false;
      aoSessaoExpirar(null);
    };
  }, [esquecer]);

  const entrar = useCallback((nova: Sessao) => {
    definirToken(nova.token);
    void salvarToken(nova.token);
    setSessao(nova);
  }, []);

  const sair = useCallback(() => {
    // O servidor é avisado, mas sair nunca depende da resposta dele.
    void authService.sair().catch(() => {});
    esquecer();
  }, [esquecer]);

  const atualizarUsuario = useCallback((usuario: Usuario) => {
    setSessao((atual) => (atual ? { ...atual, usuario } : atual));
  }, []);

  const valor = useMemo<ValorSessao>(
    () => ({
      sessao,
      usuario: sessao?.usuario ?? null,
      carregando,
      entrar,
      atualizarUsuario,
      sair,
    }),
    [sessao, carregando, entrar, atualizarUsuario, sair],
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useSessao(): ValorSessao {
  const valor = useContext(Contexto);
  if (!valor) throw new Error('useSessao precisa estar dentro do ProvedorSessao.');
  return valor;
}
