import { Protegida } from '../components';
import { TelaPerfil } from '../features/perfil/TelaPerfil';

export default function Rota() {
  return (
    <Protegida>
      <TelaPerfil />
    </Protegida>
  );
}
