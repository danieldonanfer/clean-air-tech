import { Redirect } from 'expo-router';
import type { ReactNode } from 'react';
import { useSessao } from '../store/sessao';

/**
 * Barreira das telas de dentro: sem sessão, volta para o login. Fica num
 * componente só para a regra não se repetir em cada rota — e para o dia em que
 * ela virar verificação de token no servidor.
 */
export function Protegida({ children }: { children: ReactNode }) {
  const { sessao } = useSessao();
  if (!sessao) return <Redirect href="/" />;
  return <>{children}</>;
}
