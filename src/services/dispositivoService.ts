/** Dados do aparelho pareado. Mock enquanto o pareamento real não existe. */
import type { Dispositivo } from '../types/ar';
import { espera } from './latencia';

export const dispositivoService = {
  async atual(): Promise<Dispositivo> {
    await espera(180);
    return {
      nome: 'CleanAirTech',
      comodo: 'Sala de estar',
      serie: 'CAT-0042',
      firmware: '1.0.0',
      bateria: 86,
      rede: 'Casa-Archanjo-5G',
      filtro: { vidaRestante: 72, trocarEm: 'Fevereiro de 2027' },
    };
  },
};
