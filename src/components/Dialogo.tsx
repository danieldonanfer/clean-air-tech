import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { Texto } from './Texto';
import type { ReactNode } from 'react';
import { colors, radius, spacing, typography } from '../theme';
import { Icone, type NomeDeIcone } from './Icone';

export interface DialogoProps {
  aberto: boolean;
  titulo: string;
  texto?: string;
  icone?: NomeDeIcone;
  corIcone?: string;
  fundoIcone?: string;
  /** Campos extras dentro do diálogo (ex.: a confirmação de exclusão). */
  children?: ReactNode;
  aoFechar: () => void;
  acoes: ReactNode;
}

/**
 * Confirmação de ação. Chamado Dialogo, e não Modal, para não colidir com o
 * `Modal` do React Native que ele usa por baixo.
 */
export function Dialogo({
  aberto,
  titulo,
  texto,
  icone,
  corIcone = colors.primaria,
  fundoIcone = colors.primariaSuaveAlt,
  children,
  aoFechar,
  acoes,
}: DialogoProps) {
  return (
    <Modal visible={aberto} transparent animationType="fade" onRequestClose={aoFechar}>
      <Pressable style={estilos.veu} onPress={aoFechar} accessibilityLabel="Fechar" />
      <View style={estilos.centro} pointerEvents="box-none">
        <View style={estilos.caixa} accessibilityViewIsModal accessibilityRole="alert">
          {icone && (
            <View style={[estilos.moldura, { backgroundColor: fundoIcone }]}>
              <Icone nome={icone} tamanho={24} cor={corIcone} />
            </View>
          )}
          <Texto style={estilos.titulo}>{titulo}</Texto>
          {texto && <Texto style={estilos.texto}>{texto}</Texto>}
          {children}
          <View style={estilos.acoes}>{acoes}</View>
        </View>
      </View>
    </Modal>
  );
}

/** Cobre a tela inteira. Escrito a mao porque os tipos do React Native 0.86
 * nao expoem mais `StyleSheet.absoluteFillObject`. */
const preencherTudo = { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 } as const;

const estilos = StyleSheet.create({
  veu: { ...preencherTudo, backgroundColor: colors.veu },
  centro: {
    ...preencherTudo,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.maior,
  },
  caixa: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: colors.cartao,
    borderRadius: radius.grande,
    padding: spacing.grande,
    alignItems: 'center',
    gap: spacing.pequeno,
  },
  moldura: {
    width: 52,
    height: 52,
    borderRadius: radius.pilula,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.mini,
  },
  titulo: {
    fontSize: typography.tamanho.titulo,
    fontWeight: typography.peso.extra,
    color: colors.texto,
    textAlign: 'center',
  },
  texto: {
    fontSize: typography.tamanho.pequena,
    color: colors.textoApoio,
    textAlign: 'center',
    lineHeight: typography.tamanho.pequena * typography.altura.normal,
  },
  acoes: {
    flexDirection: 'row',
    gap: spacing.pequeno + 2,
    marginTop: spacing.medio,
    alignSelf: 'stretch',
  },
});
