import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ReactNode } from 'react';
import { useLarguraDaTela } from '../hooks/useLarguraDaTela';
import { colors, spacing } from '../theme';

export interface TelaProps {
  children: ReactNode;
  /** Sem rolagem quando a tela controla a própria altura (ex.: a conversa). */
  rolar?: boolean;
  /** Mantém a coluna de formulário (520 px) mesmo em tela larga — telas de acesso. */
  estreita?: boolean;
  estiloConteudo?: StyleProp<ViewStyle>;
}

/**
 * Moldura das telas: cor de fundo, área segura e largura máxima do conteúdo.
 *
 * Em tela larga o conteúdo não se espalha de ponta a ponta — fica centralizado
 * numa coluna legível, que é o que permite o mesmo código atender celular e
 * navegador sem uma versão para cada um.
 */
export function Tela({ children, rolar = true, estreita = false, estiloConteudo }: TelaProps) {
  const { amplo } = useLarguraDaTela();
  const margens = useSafeAreaInsets();

  const conteudo = (
    <View
      style={[
        estilos.coluna,
        amplo && !estreita && estilos.colunaAmpla,
        { paddingBottom: spacing.maior + margens.bottom },
        estiloConteudo,
      ]}
    >
      {children}
    </View>
  );

  if (!rolar) {
    return (
      <View style={[estilos.fundo, { paddingTop: margens.top }]}>
        <View style={estilos.centralizador}>{conteudo}</View>
      </View>
    );
  }

  return (
    <ScrollView
      style={[estilos.fundo, { paddingTop: margens.top }]}
      contentContainerStyle={estilos.centralizador}
      keyboardShouldPersistTaps="handled"
    >
      {conteudo}
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  fundo: { flex: 1, backgroundColor: colors.fundo },
  centralizador: { flexGrow: 1, alignItems: 'center' },
  coluna: {
    width: '100%',
    flex: 1,
    maxWidth: 520,
    paddingHorizontal: spacing.grande,
    paddingTop: spacing.padrao,
    gap: spacing.padrao,
  },
  colunaAmpla: { maxWidth: 1180, paddingHorizontal: spacing.amplo },
});
