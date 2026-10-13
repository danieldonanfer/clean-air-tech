/**
 * Com `EXPO_PUBLIC_API_URL` definida, o app fala com a API real. Sem ela, usa a
 * conta simulada em memória (modo demonstração), que é o que o protótipo
 * publicado no GitHub Pages usava antes de a API existir. A URL entra na build
 * (o Expo lê variáveis `EXPO_PUBLIC_*` no momento do export), sem barra final.
 */
const bruta = process.env.EXPO_PUBLIC_API_URL?.trim() ?? '';

export const API_URL = bruta.replace(/\/+$/, '');
export const modoApi = API_URL.length > 0;
