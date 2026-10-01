import {
  StyleSheet,
  Text,
  TextInput,
  type StyleProp,
  type TextInputProps,
  type TextProps,
  type TextStyle,
} from 'react-native';
import type { Ref } from 'react';
import { familiaDoPeso } from '../theme';

/**
 * Família e peso juntos. O estilo continua dizendo só o `fontWeight`; aqui ele
 * vira a família do arquivo de fonte certo. O `fontWeight` é zerado em seguida
 * porque, com uma família que já é o peso, o navegador engrossaria de novo
 * (negrito sintético).
 */
function estiloDaFonte(style: StyleProp<TextStyle>): TextStyle {
  const { fontWeight } = StyleSheet.flatten(style) ?? {};
  return { fontFamily: familiaDoPeso(fontWeight), fontWeight: 'normal' };
}

/** `Text` com a fonte do projeto. Use no lugar do `Text` do React Native. */
export function Texto({ style, ...props }: TextProps) {
  return <Text {...props} style={[style, estiloDaFonte(style)]} />;
}

/** `TextInput` com a fonte do projeto. */
export function EntradaTexto({ style, ref, ...props }: TextInputProps & { ref?: Ref<TextInput> }) {
  return <TextInput {...props} ref={ref} style={[style, estiloDaFonte(style)]} />;
}
