/**
 * Acesso aos dados de qualidade do ar. Nenhuma tela lê o simulador direto: tudo
 * passa por aqui, então trocar o mock pela API real (ou por MQTT) não toca em
 * componente nenhum (ver docs/ARQUITETURA.md).
 */
import type { Historico, Leitura, PeriodoHistorico, PontoDoDia } from '../types/ar';
import { espera } from './latencia';
import * as simulador from './simulador';

export const arService = {
  async leituraAgora(): Promise<Leitura> {
    await espera(180);
    return simulador.leituraEm();
  },

  async leiturasDoDia(): Promise<PontoDoDia[]> {
    await espera(180);
    return simulador.leiturasDoDia();
  },

  async historico(periodo: PeriodoHistorico): Promise<Historico> {
    await espera(260);
    return simulador.historico(periodo);
  },
};
