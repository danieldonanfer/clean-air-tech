import { StyleSheet, View } from 'react-native';
import { Texto } from './Texto';
import { colors, radius, spacing, typography } from '../theme';

export interface PassosProps {
  atual: number;
  total: number;
  rotulo: string;
}

/** Progresso de um fluxo de várias etapas (a recuperação de senha tem três). */
export function Passos({ atual, total, rotulo }: PassosProps) {
  return (
    <View
      style={estilos.bloco}
      accessibilityRole="progressbar"
      accessibilityLabel={`Etapa ${atual} de ${total}: ${rotulo}`}
    >
      <View style={estilos.trilhas}>
        {Array.from({ length: total }, (_, i) => (
          <View
            key={i}
            style={[
              estilos.trilha,
              { backgroundColor: i < atual ? colors.primaria : colors.borda },
            ]}
          />
        ))}
      </View>
      <Texto style={estilos.texto}>
        Etapa {atual} de {total} · {rotulo}
      </Texto>
    </View>
  );
}

const estilos = StyleSheet.create({
  bloco: { gap: spacing.pequeno - 2 },
  trilhas: { flexDirection: 'row', gap: spacing.mini + 2 },
  trilha: { flex: 1, height: 4, borderRadius: radius.pilula },
  texto: {
    fontSize: typography.tamanho.mini,
    fontWeight: typography.peso.semi,
    color: colors.textoFraco,
  },
});
