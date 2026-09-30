import { useState } from 'react';
import { Pressable, StyleSheet, View, type TextStyle } from 'react-native';
import { Texto, EntradaTexto } from './Texto';
import { alvoToqueMinimo, colors, radius, spacing, typography } from '../theme';
import { Icone, type NomeDeIcone } from './Icone';

export interface CampoProps {
  rotulo: string;
  valor: string;
  aoMudar: (valor: string) => void;
  tipo?: 'texto' | 'email' | 'senha' | 'telefone' | 'numero';
  icone?: NomeDeIcone;
  dica?: string;
  erro?: string | null;
  /** Texto do atalho à direita do rótulo (ex.: "Esqueci a senha?"). */
  apoio?: string;
  aoTocarApoio?: () => void;
  autoFoco?: boolean;
  /** Chamado ao confirmar pelo teclado (Enter no web, "ok" no celular). */
  aoEnviar?: () => void;
}

export function Campo({
  rotulo,
  valor,
  aoMudar,
  tipo = 'texto',
  icone,
  dica,
  erro,
  apoio,
  aoTocarApoio,
  autoFoco = false,
  aoEnviar,
}: CampoProps) {
  const [focado, setFocado] = useState(false);
  const [revelada, setRevelada] = useState(false);
  const senha = tipo === 'senha';

  return (
    <View style={estilos.bloco}>
      <View style={estilos.linhaRotulo}>
        <Texto style={estilos.rotulo}>{rotulo}</Texto>
        {apoio && aoTocarApoio && (
          <Pressable onPress={aoTocarApoio} accessibilityRole="button" accessibilityLabel={apoio}>
            <Texto style={estilos.apoio}>{apoio}</Texto>
          </Pressable>
        )}
      </View>

      <View style={[estilos.caixa, focado && estilos.caixaFocada, !!erro && estilos.caixaComErro]}>
        {icone && <Icone nome={icone} tamanho={18} cor={colors.textoFraco} />}
        <EntradaTexto
          value={valor}
          onChangeText={aoMudar}
          onFocus={() => setFocado(true)}
          onBlur={() => setFocado(false)}
          onSubmitEditing={aoEnviar}
          placeholder={dica}
          placeholderTextColor={colors.textoTenue}
          secureTextEntry={senha && !revelada}
          autoFocus={autoFoco}
          autoCapitalize={tipo === 'email' || senha ? 'none' : 'sentences'}
          autoCorrect={false}
          keyboardType={TECLADO[tipo]}
          accessibilityLabel={rotulo}
          style={[estilos.entrada, SEM_ANEL_DE_FOCO]}
        />
        {senha && (
          <Pressable
            onPress={() => setRevelada((r) => !r)}
            accessibilityRole="button"
            accessibilityLabel={revelada ? 'Ocultar a senha' : 'Mostrar a senha'}
            hitSlop={10}
          >
            <Icone nome={revelada ? 'olhoFechado' : 'olho'} tamanho={19} cor={colors.textoFraco} />
          </Pressable>
        )}
      </View>

      {erro && <Texto style={estilos.erro}>{erro}</Texto>}
    </View>
  );
}

const TECLADO = {
  texto: 'default',
  email: 'email-address',
  senha: 'default',
  telefone: 'phone-pad',
  numero: 'number-pad',
} as const;

/**
 * A borda da caixa já mostra o foco; sem isto o navegador soma o anel padrão.
 * `outlineStyle: 'none'` existe no react-native-web mas não nos tipos do React
 * Native, então o valor passa por um cast e fica isolado aqui.
 */
const SEM_ANEL_DE_FOCO = { outlineStyle: 'none' } as unknown as TextStyle;

const estilos = StyleSheet.create({
  bloco: { gap: spacing.mini + 2 },
  linhaRotulo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rotulo: {
    fontSize: typography.tamanho.minuscula,
    fontWeight: typography.peso.forte,
    color: colors.textoMedio,
  },
  apoio: {
    fontSize: typography.tamanho.minuscula,
    fontWeight: typography.peso.forte,
    color: colors.primaria,
  },
  caixa: {
    minHeight: alvoToqueMinimo + 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.pequeno + 2,
    backgroundColor: colors.cartao,
    borderWidth: 1,
    borderColor: colors.borda,
    borderRadius: radius.cartao,
    paddingHorizontal: spacing.medio + 2,
  },
  caixaFocada: { borderColor: colors.primaria },
  caixaComErro: { borderColor: colors.perigoBorda, backgroundColor: colors.perigoFundoSuave },
  entrada: {
    flex: 1,
    paddingVertical: spacing.medio,
    fontSize: typography.tamanho.corpoGrande,
    color: colors.texto,
  },
  erro: {
    fontSize: typography.tamanho.mini,
    fontWeight: typography.peso.semi,
    color: colors.perigo,
  },
});
