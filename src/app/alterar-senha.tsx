import { Protegida } from '../components';
import { TelaAlterarSenha } from '../features/perfil/TelaAlterarSenha';

export default function Rota() {
  return (
    <Protegida>
      <TelaAlterarSenha />
    </Protegida>
  );
}
