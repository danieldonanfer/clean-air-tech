import { Pressable, StyleSheet, View } from 'react-native';
import { Texto } from './Texto';
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { alvoToqueMinimo, colors, radius, spacing, typography } from '../theme';
import { Icone } from './Icone';

export interface CabecalhoProps {
  titulo: string;
  apoio?: string;
  /** Rota do botão de voltar. Sem ela, o botão não aparece. */
  voltarPara?: string;
  direita?: ReactNode;
}

/** Topo das telas. O botão de voltar só existe nas telas de segundo nível. */
export function Cabecalho({ titulo, apoio, voltarPara, direita }: CabecalhoProps) {
  return (
    <View style={estilos.bloco}>
      {voltarPara && (
        <Pressable
          onPress={() => router.replace(voltarPara)}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          hitSlop={8}
          style={estilos.voltar}
        >
          <Icone nome="voltar" tamanho={20} cor={colors.textoMedio} />
        </Pressable>
      )}
      <View style={estilos.textos}>
        <Texto style={estilos.titulo}>{titulo}</Texto>
        {apoio && <Texto style={estilos.apoio}>{apoio}</Texto>}
      </View>
      {direita}
    </View>
  );
}

const estilos = StyleSheet.create({
  bloco: { flexDirection: 'row', alignItems: 'center', gap: spacing.medio },
  voltar: {
    width: alvoToqueMinimo,
    height: alvoToqueMinimo,
    marginLeft: -spacing.medio,
    borderRadius: radius.medio,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textos: { flex: 1, gap: spacing.micro },
  titulo: {
    fontSize: typography.tamanho.cabecalho,
    fontWeight: typography.peso.extra,
    color: colors.texto,
    letterSpacing: -0.5,
  },
  apoio: { fontSize: typography.tamanho.apoio, color: colors.textoFraco },
});
