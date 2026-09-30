import { Protegida } from '../components';
import { TelaPrivacidade } from '../features/configuracoes/TelaPrivacidade';

export default function Rota() {
  return (
    <Protegida>
      <TelaPrivacidade />
    </Protegida>
  );
}
