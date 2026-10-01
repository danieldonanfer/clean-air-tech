/**
 * Assistente de aconselhamento.
 *
 * Não há inteligência artificial aqui: a resposta é montada a partir da leitura
 * atual dos sensores, comparada com os limites de referência. Para o protótipo
 * isso já mostra a conversa funcionando com os dados do próprio sistema, e deixa
 * explícito onde a integração de verdade vai entrar.
 */
import type { Leitura } from '../types/ar';
import { espera } from './latencia';
import { leituraEm } from './simulador';

export interface RespostaAssistente {
  resposta: string;
  leitura: Leitura;
  respondidoEm: string;
}

/** Cada regra: as palavras que a disparam e como ela responde. */
const REGRAS: { termos: string[]; responder: (l: Leitura) => string }[] = [
  {
    termos: ['co2', 'co₂', 'gás', 'gas', 'janela'],
    responder: (l) =>
      l.co2 > 900
        ? `O CO₂ está em ${l.co2} ppm, acima do confortável. Vale abrir uma janela por uns 10 minutos.`
        : `O CO₂ está em ${l.co2} ppm, dentro do esperado para um ambiente ventilado.`,
  },
  {
    termos: ['poeira', 'partícul', 'particul', 'pm'],
    responder: (l) =>
      `O material particulado fino está em ${l.pm25} µg/m³, e o limite recomendado pela OMS é 15 µg/m³.`,
  },
  {
    termos: ['filtro'],
    responder: () =>
      'O filtro HEPA está com boa parte da vida útil. Costuma durar cerca de seis meses em uso contínuo.',
  },
  {
    termos: ['alergia', 'asma', 'respir'],
    responder: (l) =>
      l.iqa <= 50
        ? `O índice está em ${l.iqa}, considerado bom. É um ambiente adequado para quem tem sensibilidade respiratória.`
        : `O índice está em ${l.iqa}. Para quem tem sensibilidade respiratória, vale reforçar a purificação agora.`,
  },
];

function resumoGeral(l: Leitura): string {
  return (
    `Agora o índice está em ${l.iqa}, com ${l.pm25} µg/m³ de partículas finas e ` +
    `${l.co2} ppm de CO₂. Posso detalhar qualquer um desses pontos.`
  );
}

export const assistenteService = {
  async perguntar(pergunta: string): Promise<RespostaAssistente> {
    await espera(640);
    const texto = pergunta.toLowerCase();
    const leitura = leituraEm();
    const regra = REGRAS.find((r) => r.termos.some((t) => texto.includes(t)));
    return {
      resposta: regra ? regra.responder(leitura) : resumoGeral(leitura),
      leitura,
      respondidoEm: new Date().toISOString(),
    };
  },

  sugestoes(): string[] {
    return [
      'Como está o CO₂ agora?',
      'E a poeira fina?',
      'Isso é bom para quem tem asma?',
      'Quando trocar o filtro?',
    ];
  },
};
