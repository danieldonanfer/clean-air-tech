import { StyleSheet, View } from 'react-native';
import { Texto } from './Texto';
import { colors, radius, spacing, typography } from '../theme';
import { avaliarSenha, rotuloDaForca } from '../utils/senha';
import { Icone } from './Icone';

export interface ForcaSenhaProps {
  senha: string;
  /** Quando informada, a conferência das duas senhas entra na lista. */
  confirmacao?: string;
}

/** Medidor de senha: barra de força mais a lista de requisitos. */
export function ForcaSenha({ senha, confirmacao }: ForcaSenhaProps) {
  const { regras, forca } = avaliarSenha(senha);
  const cor = CORES_FORCA[forca] ?? colors.perigo;

  const itens = [...regras];
  if (confirmacao !== undefined) {
    itens.push({
      chave: 'confere',
      rotulo: 'As duas senhas conferem',
      ok: senha.length > 0 && senha === confirmacao,
    });
  }

  return (
    <View style={estilos.bloco}>
      <View style={estilos.trilhas}>
        {[0, 1, 2, 3].map((i) => (
          <View
            key={i}
            style={[estilos.trilha, { backgroundColor: i < forca ? cor : colors.bordaClara }]}
          />
        ))}
      </View>

      <Texto style={[estilos.forca, { color: senha ? cor : colors.textoFraco }]}>
        {senha ? rotuloDaForca(forca) : 'Digite uma senha'}
      </Texto>

      <View style={estilos.lista}>
        {itens.map((item) => (
          <View key={item.chave} style={estilos.item}>
            <Icone
              nome={item.ok ? 'vistoCirculo' : 'circulo'}
              tamanho={15}
              cor={item.ok ? colors.sucesso : colors.textoTenue}
              traco={2.2}
            />
            <Texto style={[estilos.itemTexto, item.ok && estilos.itemAtendido]}>
              {item.rotulo}
            </Texto>
          </View>
        ))}
      </View>
    </View>
  );
}

const CORES_FORCA = [
  colors.perigo,
  colors.perigo,
  colors.atencaoForte,
  colors.primaria,
  colors.sucessoForte,
];

const estilos = StyleSheet.create({
  bloco: { gap: spacing.pequeno },
  trilhas: { flexDirection: 'row', gap: spacing.mini + 2 },
  trilha: { flex: 1, height: 5, borderRadius: radius.pilula },
  forca: { fontSize: typography.tamanho.mini, fontWeight: typography.peso.forte },
  lista: { gap: spacing.mini + 2 },
  item: { flexDirection: 'row', alignItems: 'center', gap: spacing.pequeno - 1 },
  itemTexto: { fontSize: typography.tamanho.minuscula, color: colors.textoApoio },
  itemAtendido: { color: colors.textoForte, fontWeight: typography.peso.semi },
});
