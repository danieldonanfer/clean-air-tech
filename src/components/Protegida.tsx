import { Redirect } from 'expo-router';
import type { ReactNode } from 'react';
import { useSessao } from '../store/sessao';
import { Carregando } from './Carregando';

/**
 * Barreira das telas de dentro: sem sessão, volta para o login. Enquanto o app
 * confere o token guardado, espera — senão recarregar a página mandaria para o
 * login quem ainda tem sessão válida. Fica num componente só para a regra não se
 * repetir em cada rota.
 */
export function Protegida({ children }: { children: ReactNode }) {
  const { sessao, carregando } = useSessao();
  if (carregando) return <Carregando texto="Verificando sua sessão…" />;
  if (!sessao) return <Redirect href="/" />;
  return <>{children}</>;
}
