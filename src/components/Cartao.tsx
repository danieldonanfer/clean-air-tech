import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import type { ReactNode } from 'react';
import { colors, radius, spacing } from '../theme';

export interface CartaoProps {
  children: ReactNode;
  estilo?: StyleProp<ViewStyle>;
  aoTocar?: () => void;
  rotuloAcessivel?: string;
}

/** Superfície branca padrão. Vira botão quando recebe `aoTocar`. */
export function Cartao({ children, estilo, aoTocar, rotuloAcessivel }: CartaoProps) {
  if (!aoTocar) {
    return <View style={[estilos.cartao, estilo]}>{children}</View>;
  }
  return (
    <Pressable
      onPress={aoTocar}
      accessibilityRole="button"
      accessibilityLabel={rotuloAcessivel}
      style={({ pressed }) => [estilos.cartao, estilo, pressed && estilos.pressionado]}
    >
      {children}
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  cartao: {
    backgroundColor: colors.cartao,
    borderRadius: radius.painel,
    borderWidth: 1,
    borderColor: colors.bordaCartao,
    padding: spacing.padrao,
  },
  pressionado: { opacity: 0.9 },
});
