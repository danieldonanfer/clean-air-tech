import { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { Aviso, Botao, Campo, Tela, Texto } from '../../components';
import { authService } from '../../services/authService';
import { CONTA_DEMONSTRACAO } from '../../services/contaLocal';
import { useSessao } from '../../store/sessao';
import { colors, spacing, typography } from '../../theme';
import { MarcaAcesso } from './componentes/MarcaAcesso';

/** Tela 1 — entrada no aplicativo. */
export function TelaLogin() {
  const { entrar } = useSessao();
  const [email, setEmail] = useState<string>(CONTA_DEMONSTRACAO.email);
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function autenticar() {
    setErro(null);
    setCarregando(true);
    try {
      entrar(await authService.entrar(email, senha));
      router.replace('/painel');
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não foi possível entrar.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <Tela estreita>
      <MarcaAcesso />

      <Aviso>{erro}</Aviso>

      <Campo
        rotulo="E-mail"
        valor={email}
        aoMudar={setEmail}
        tipo="email"
        icone="email"
        dica="nome@gmail.com"
      />
      <Campo
        rotulo="Senha"
        valor={senha}
        aoMudar={setSenha}
        tipo="senha"
        icone="cadeado"
        dica="sua senha"
        aoEnviar={() => {
          if (email && senha && !carregando) void autenticar();
        }}
      />

      <Botao aoTocar={autenticar} carregando={carregando} desabilitado={!email || !senha}>
        Entrar
      </Botao>

      <Pressable
        onPress={() => router.push('/esqueci-senha')}
        accessibilityRole="link"
        accessibilityLabel="Esqueceu a senha?"
        style={estilos.linkDireita}
      >
        <Texto style={estilos.link}>Esqueceu a senha?</Texto>
      </Pressable>

      <View style={estilos.separador}>
        <View style={estilos.risco} />
        <Texto style={estilos.separadorTexto}>Ou entre com</Texto>
        <View style={estilos.risco} />
      </View>

      <View style={estilos.duplo}>
        <View style={estilos.metade}>
          <Botao
            tipo="secundario"
            aoTocar={() => setErro('A entrada por Apple ID ainda não faz parte do protótipo.')}
          >
            Apple ID
          </Botao>
        </View>
        <View style={estilos.metade}>
          <Botao
            tipo="secundario"
            aoTocar={() => setErro('A entrada por Google ainda não faz parte do protótipo.')}
          >
            Google
          </Botao>
        </View>
      </View>

      <View style={estilos.rodape}>
        <Texto style={estilos.rodapeTexto}>Primeiro acesso? </Texto>
        <Pressable
          onPress={() => router.push('/cadastro')}
          accessibilityRole="link"
          accessibilityLabel="Solicite uma conta"
        >
          <Texto style={[estilos.link, estilos.linkForte]}>Solicite uma conta</Texto>
        </Pressable>
      </View>

      <Texto style={estilos.nota}>
        Protótipo do TCC · a conta de demonstração é {CONTA_DEMONSTRACAO.email} com a senha{' '}
        {CONTA_DEMONSTRACAO.senha}
      </Texto>
    </Tela>
  );
}

const estilos = StyleSheet.create({
  linkDireita: { alignSelf: 'flex-end', marginTop: -spacing.pequeno },
  link: {
    fontSize: typography.tamanho.apoio,
    fontWeight: typography.peso.semi,
    color: colors.primaria,
  },
  linkForte: { fontWeight: typography.peso.forte },
  separador: { flexDirection: 'row', alignItems: 'center', gap: spacing.medio },
  risco: { flex: 1, height: 1, backgroundColor: colors.borda },
  separadorTexto: { fontSize: typography.tamanho.minuscula, color: colors.textoFraco },
  duplo: { flexDirection: 'row', gap: spacing.medio },
  metade: { flex: 1 },
  rodape: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  rodapeTexto: { fontSize: typography.tamanho.apoio, color: colors.textoApoio },
  nota: {
    marginTop: 'auto',
    textAlign: 'center',
    fontSize: typography.tamanho.mini,
    color: colors.textoTenue,
    lineHeight: typography.tamanho.mini * typography.altura.normal,
  },
});
