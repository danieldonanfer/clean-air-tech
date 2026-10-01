import { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import {
  Aviso,
  Botao,
  Cabecalho,
  Campo,
  ForcaSenha,
  Icone,
  Passos,
  Tela,
  Texto,
} from '../../components';
import { authService } from '../../services/authService';
import { colors, radius, spacing, typography } from '../../theme';
import { avaliarSenha } from '../../utils/senha';

/** Tela 4 — terceiro passo: cadastrar a nova senha. */
export function TelaNovaSenha() {
  const { email, codigo } = useLocalSearchParams<{ email?: string; codigo?: string }>();
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (!email || !codigo) router.replace('/esqueci-senha');
  }, [email, codigo]);

  const pronta = avaliarSenha(senha).valida && senha === confirmacao;

  async function salvar() {
    if (!email || !codigo) return;
    setErro(null);
    setCarregando(true);
    try {
      await authService.redefinirSenha(email, codigo, senha);
      router.replace('/');
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não foi possível redefinir a senha.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <Tela estreita>
      <Cabecalho titulo="Criar nova senha" voltarPara="/esqueci-senha" />
      <Passos atual={3} total={3} rotulo="Nova senha" />

      <View style={estilos.dica}>
        <Icone nome="chave" tamanho={20} cor={colors.primaria} />
        <Texto style={estilos.dicaTexto}>
          Escolha uma senha diferente das anteriores para manter o seu CleanAirTech protegido.
        </Texto>
      </View>

      <Aviso>{erro}</Aviso>

      <Campo
        rotulo="Nova senha"
        valor={senha}
        aoMudar={setSenha}
        tipo="senha"
        icone="cadeado"
        dica="mínimo de 8 caracteres"
      />
      <ForcaSenha senha={senha} confirmacao={confirmacao} />
      <Campo
        rotulo="Confirmar nova senha"
        valor={confirmacao}
        aoMudar={setConfirmacao}
        tipo="senha"
        icone="cadeado"
        dica="repita a senha"
      />

      <Botao aoTocar={salvar} carregando={carregando} desabilitado={!pronta}>
        Redefinir senha e entrar
      </Botao>
      <Botao tipo="fantasma" aoTocar={() => router.replace('/')}>
        Cancelar e voltar ao login
      </Botao>
    </Tela>
  );
}

const estilos = StyleSheet.create({
  dica: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.medio,
    backgroundColor: colors.primariaSuave,
    borderWidth: 1,
    borderColor: colors.primariaBorda,
    borderRadius: radius.cartao,
    padding: spacing.medio,
  },
  dicaTexto: {
    flex: 1,
    fontSize: typography.tamanho.pequena,
    color: colors.textoMedio,
    lineHeight: typography.tamanho.pequena * typography.altura.normal,
  },
});
