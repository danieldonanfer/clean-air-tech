/** Formatação de números e datas para exibição, sempre em pt-BR. */

/** Troca o ponto decimal pela vírgula, como se escreve em português. */
export function numero(valor: number, casas = 1): string {
  return valor.toFixed(casas).replace('.', ',');
}

/** Hora no formato 24h (ex.: "14:05"). */
export function hora(data: Date): string {
  const hh = String(data.getHours()).padStart(2, '0');
  const mm = String(data.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

const DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
const MESES = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
];

/** Ex.: "quinta, 30 de setembro". */
export function dataLonga(data: Date): string {
  return `${DIAS[data.getDay()]}, ${data.getDate()} de ${MESES[data.getMonth()]}`;
}

/** Saudação conforme a hora do dia. */
export function saudacao(data: Date): string {
  const h = data.getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}
