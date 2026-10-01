import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { Texto } from './Texto';
import { colors, radius, spacing, typography, alvoToqueMinimo } from '../theme';

export type TipoDeBotao = 'principal' | 'secundario' | 'fantasma' | 'perigo';

export interface BotaoProps {
  children: string;
  aoTocar: () => void;
  tipo?: TipoDeBotao;
  carregando?: boolean;
  desabilitado?: boolean;
  /** Ocupa a largura toda (padrão) ou só o necessário. */
  esticar?: boolean;
}

export function Botao({
  children,
  aoTocar,
  tipo = 'principal',
  carregando = false,
  desabilitado = false,
  esticar = true,
}: BotaoProps) {
  const inativo = desabilitado || carregando;
  const visual = VISUAL[tipo];

  return (
    <Pressable
      onPress={aoTocar}
      disabled={inativo}
      accessibilityRole="button"
      accessibilityLabel={children}
      accessibilityState={{ disabled: inativo, busy: carregando }}
      style={({ pressed }) => [
        estilos.base,
        { backgroundColor: visual.fundo, borderColor: visual.borda },
        esticar ? estilos.esticado : estilos.justo,
        inativo && estilos.inativo,
        pressed && !inativo && estilos.pressionado,
      ]}
    >
      {carregando ? (
        <ActivityIndicator size="small" color={visual.texto} />
      ) : (
        <View style={estilos.conteudo}>
          <Texto style={[estilos.rotulo, { color: visual.texto }]}>{children}</Texto>
        </View>
      )}
    </Pressable>
  );
}

const VISUAL: Record<TipoDeBotao, { fundo: string; borda: string; texto: string }> = {
  principal: { fundo: colors.primaria, borda: colors.primaria, texto: colors.cartao },
  secundario: { fundo: colors.cartao, borda: colors.borda, texto: colors.textoMedio },
  fantasma: { fundo: colors.transparente, borda: colors.transparente, texto: colors.textoApoio },
  perigo: { fundo: colors.perigo, borda: colors.perigo, texto: colors.cartao },
};

const estilos = StyleSheet.create({
  base: {
    minHeight: alvoToqueMinimo + 4,
    borderRadius: radius.cartao,
    borderWidth: 1,
    paddingHorizontal: spacing.grande,
    alignItems: 'center',
    justifyContent: 'center',
  },
  esticado: { alignSelf: 'stretch' },
  justo: { alignSelf: 'flex-start' },
  conteudo: { flexDirection: 'row', alignItems: 'center', gap: spacing.pequeno },
  rotulo: {
    fontSize: typography.tamanho.corpoGrande,
    fontWeight: typography.peso.forte,
  },
  inativo: { opacity: 0.45 },
  pressionado: { opacity: 0.82 },
});
