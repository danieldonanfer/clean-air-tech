import { Redirect } from 'expo-router';
import { Carregando } from '../components';
import { TelaLogin } from '../features/autenticacao/TelaLogin';
import { useSessao } from '../store/sessao';

export default function Rota() {
  const { sessao, carregando } = useSessao();
  if (carregando) return <Carregando texto="Verificando sua sessão…" />;
  if (sessao) return <Redirect href="/painel" />;
  return <TelaLogin />;
}
