/**
 * EXEMPLO — demonstra o padrão de teste do projeto (ver docs/ARQUITETURA.md).
 * Remova este arquivo e seu teste quando a primeira função real de src/utils for criada.
 */
export function clampAqi(value: number): number {
  return Math.min(500, Math.max(0, Math.round(value)));
}
