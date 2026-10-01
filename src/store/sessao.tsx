/**
 * Sessão do usuário.
 *
 * Context API pura, de propósito: a biblioteca de estado global do projeto ainda
 * não foi escolhida (ver o fim de docs/ARQUITETURA.md), e um protótipo de telas
 * não justifica decidir isso sozinho. Quando o time escolher (Zustand, Redux
 * Toolkit ou continuar com Context), é este arquivo que muda — as telas usam
 * `useSessao()` e não sabem o que tem por baixo.
 *
 * A sessão vive só em memória: recarregar a página web derruba o login. Manter
 * entre execuções exige armazenamento persistente (`expo-secure-store` ou
 * AsyncStorage), que é dependência nova e fica para depois do alinhamento.
 */
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Sessao, Usuario } from '../types/usuario';

interface ValorSessao {
  sessao: Sessao | null;
  usuario: Usuario | null;
  entrar: (sessao: Sessao) => void;
  atualizarUsuario: (usuario: Usuario) => void;
  sair: () => void;
}

const Contexto = createContext<ValorSessao | null>(null);

export function ProvedorSessao({ children }: { children: ReactNode }) {
  const [sessao, setSessao] = useState<Sessao | null>(null);

  const entrar = useCallback((nova: Sessao) => setSessao(nova), []);
  const sair = useCallback(() => setSessao(null), []);
  const atualizarUsuario = useCallback((usuario: Usuario) => {
    setSessao((atual) => (atual ? { ...atual, usuario } : atual));
  }, []);

  const valor = useMemo<ValorSessao>(
    () => ({ sessao, usuario: sessao?.usuario ?? null, entrar, atualizarUsuario, sair }),
    [sessao, entrar, atualizarUsuario, sair],
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useSessao(): ValorSessao {
  const valor = useContext(Contexto);
  if (!valor) throw new Error('useSessao precisa estar dentro do ProvedorSessao.');
  return valor;
}
