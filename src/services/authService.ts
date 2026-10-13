/**
 * Entrada, recuperação de senha e cadastro. Escolhe a implementação uma vez, pela
 * configuração: API real quando `EXPO_PUBLIC_API_URL` existe, conta simulada
 * (modo demonstração) quando não.
 */
import { authApi } from './authApi';
import type { AuthService } from './authContrato';
import { authMock } from './authMock';
import { modoApi } from './config';

export type { PedidoDeCodigo } from './authContrato';
export const authService: AuthService = modoApi ? authApi : authMock;
