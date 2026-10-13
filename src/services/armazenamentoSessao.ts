/**
 * Guarda o token da sessão entre execuções, para recarregar a página (ou reabrir o
 * app) não derrubar o login. No celular vai para o armazenamento seguro do
 * sistema (Keychain/Keystore); na web, para o localStorage. Na web o token fica
 * ao alcance de qualquer script da página, então o app não pode carregar código
 * de terceiros não confiável — risco aceito para o escopo do TCC.
 *
 * Nada aqui lança erro: se o armazenamento falhar (modo privado do navegador, por
 * exemplo), o app só deixa de lembrar a sessão.
 */
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const CHAVE = 'cleanair.sessao.token';

export async function lerToken(): Promise<string | null> {
  try {
    if (Platform.OS === 'web') return globalThis.localStorage?.getItem(CHAVE) ?? null;
    return await SecureStore.getItemAsync(CHAVE);
  } catch {
    return null;
  }
}

export async function salvarToken(token: string): Promise<void> {
  try {
    if (Platform.OS === 'web') globalThis.localStorage?.setItem(CHAVE, token);
    else await SecureStore.setItemAsync(CHAVE, token);
  } catch {
    // sem armazenamento: o login vale só até fechar o app
  }
}

export async function apagarToken(): Promise<void> {
  try {
    if (Platform.OS === 'web') globalThis.localStorage?.removeItem(CHAVE);
    else await SecureStore.deleteItemAsync(CHAVE);
  } catch {
    // nada a fazer
  }
}
