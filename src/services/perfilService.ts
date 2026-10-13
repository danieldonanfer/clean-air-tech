/** Dados pessoais, troca de senha e exclusão da conta (mesma escolha de `authService`). */
import type { PerfilService } from './authContrato';
import { modoApi } from './config';
import { perfilApi } from './perfilApi';
import { perfilMock } from './perfilMock';

export const perfilService: PerfilService = modoApi ? perfilApi : perfilMock;
