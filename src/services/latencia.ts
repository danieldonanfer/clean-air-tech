/**
 * Atraso artificial das respostas do mock. Sem ele as telas trocam de estado
 * instantaneamente e os indicadores de carregamento nunca aparecem — o que
 * esconderia, na apresentação, um comportamento que existe no app real.
 */
export function espera(ms = 320): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
