import { useState } from 'react';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Aviso, Botao, Cabecalho, Campo, Icone, Passos, Tela, Texto } from '../../components';
import { authService } from '../../services/authService';
import { CONTA_DEMONSTRACAO } from '../../services/contaLocal';
import { colors, radius, spacing, typography } from '../../theme';

/**
 * Tela 2 — primeiro dos três passos da recuperação de senha. A contagem diz
 * "de 3" porque são três mesmo: informar o e-mail, digitar o código e cadastrar
 * a nova senha.
 */
export function TelaEsqueciSenha() {
  const [email, setEmail] = useState<string>(CONTA_DEMONSTRACAO.email);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function enviar() {
    setErro(null);
    setCarregando(true);
    try {
      const pedido = await authService.pedirCodigo(email);
      router.push({
        pathname: '/verificar-email',
        params: { email: pedido.email, codigoDemo: pedido.codigoParaDemonstracao },
      });
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não foi possível enviar o código.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <Tela estreita>
      <Cabecalho titulo="Recuperar acesso" voltarPara="/" />
      <Passos atual={1} total={3} rotulo="E-mail" />

      <View style={estilos.explicacao}>
        <View style={estilos.moldura}>
          <Icone nome="email" tamanho={28} cor={colors.primaria} />
        </View>
        <Texto style={estilos.texto}>
          Informe o e-mail da conta. Enviamos um código de acesso seguro de 6 dígitos para ele.
        </Texto>
      </View>

      <Aviso>{erro}</Aviso>

      <Campo
        rotulo="E-mail da conta"
        valor={email}
        aoMudar={setEmail}
        tipo="email"
        icone="email"
        dica="nome@gmail.com"
      />

      <Botao aoTocar={enviar} carregando={carregando} desabilitado={!email}>
        Enviar código
      </Botao>
      <Botao tipo="fantasma" aoTocar={() => router.replace('/')}>
        Lembrei a senha, voltar ao login
      </Botao>
    </Tela>
  );
}

const estilos = StyleSheet.create({
  explicacao: { alignItems: 'center', gap: spacing.medio, paddingVertical: spacing.medio },
  moldura: {
    width: 62,
    height: 62,
    borderRadius: radius.pilula,
    backgroundColor: colors.primariaSuaveAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texto: {
    fontSize: typography.tamanho.apoio,
    color: colors.textoApoio,
    textAlign: 'center',
    lineHeight: typography.tamanho.apoio * typography.altura.normal,
  },
});
