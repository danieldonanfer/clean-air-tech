import { colors, faixasIQA } from './colors';
import { alvoToqueMinimo, larguraAmpla, radius, spacing } from './spacing';
import { familiaDoPeso, typography } from './typography';

export const theme = {
  colors,
  faixasIQA,
  typography,
  spacing,
  radius,
  alvoToqueMinimo,
  larguraAmpla,
} as const;

export {
  alvoToqueMinimo,
  colors,
  faixasIQA,
  familiaDoPeso,
  larguraAmpla,
  radius,
  spacing,
  typography,
};
export type Theme = typeof theme;
