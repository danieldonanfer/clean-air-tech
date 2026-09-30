import { useEffect, useRef, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, type TextInput, View } from 'react-native';
import { Aviso, Botao, Cabecalho, Passos, Tela, Texto, EntradaTexto } from '../../components';
import { authService } from '../../services/authService';
import { colors, radius, spacing, typography } from '../../theme';

const CASAS = 6;

/** Tela 3 — o código de 6 dígitos, com os campos avançando sozinhos. */
export function TelaVerificarEmail() {
  const { email, codigoDemo } = useLocalSearchParams<{ email?: string; codigoDemo?: string }>();
  const [digitos, setDigitos] = useState<string[]>(Array(CASAS).fill(''));
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [segundos, setSegundos] = useState(299);
  const campos = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (!email) router.replace('/esqueci-senha');
  }, [email]);

  useEffect(() => {
    const t = setInterval(() => setSegundos((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  function digitar(indice: number, valor: string) {
    const limpo = valor.replace(/\D/g, '');

    // Três ou mais dígitos de uma vez só podem ser uma colagem (ou o código que o
    // teclado sugere por SMS): distribui pelas casas a partir da atual.
    if (limpo.length > 2) {
      const colados = limpo.slice(0, CASAS - indice).split('');
      setDigitos((atuais) => atuais.map((d, i) => colados[i - indice] ?? d));
      campos.current[Math.min(indice + colados.length, CASAS - 1)]?.focus();
      return;
    }

    // Digitar por cima de um dígito já preenchido entrega dois: vale o novo.
    const unico = limpo.slice(-1);
    setDigitos((atuais) => atuais.map((d, i) => (i === indice ? unico : d)));
    if (unico && indice < CASAS - 1) campos.current[indice + 1]?.focus();
  }

  function apagar(indice: number) {
    if (!digitos[indice] && indice > 0) campos.current[indice - 1]?.focus();
  }

  const codigo = digitos.join('');

  async function confirmar() {
    if (!email) return;
    setErro(null);
    setCarregando(true);
    try {
      await authService.conferirCodigo(email, codigo);
      router.push({ pathname: '/nova-senha', params: { email, codigo } });
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não foi possível conferir o código.');
    } finally {
      setCarregando(false);
    }
  }

  const minutos = String(Math.floor(segundos / 60)).padStart(2, '0');
  const resto = String(segundos % 60).padStart(2, '0');

  return (
    <Tela estreita>
      <Cabecalho titulo="Verifique o seu e-mail" voltarPara="/esqueci-senha" />
      <Passos atual={2} total={3} rotulo="Código" />

      <Texto style={estilos.texto}>
        Enviamos um código de acesso seguro de 6 dígitos para o e-mail{'\n'}
        <Texto style={estilos.email}>{email}</Texto>
      </Texto>

      <Aviso>{erro}</Aviso>

      <View style={estilos.casas}>
        {digitos.map((digito, i) => (
          <EntradaTexto
            key={i}
            ref={(el) => {
              campos.current[i] = el;
            }}
            value={digito}
            onChangeText={(v) => digitar(i, v)}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === 'Backspace') apagar(i);
            }}
            keyboardType="number-pad"
            maxLength={CASAS}
            accessibilityLabel={`Dígito ${i + 1} de ${CASAS}`}
            style={[estilos.casa, !!digito && estilos.casaPreenchida]}
          />
        ))}
      </View>

      <Texto style={estilos.contagem}>
        {segundos > 0
          ? `O código expira em ${minutos}:${resto}`
          : 'O código expirou. Peça um novo.'}
      </Texto>

      {codigoDemo && (
        <View style={estilos.notaDemo}>
          <Texto style={estilos.notaDemoTexto}>
            No protótipo o código não sai por e-mail. Ele é{' '}
            <Texto style={estilos.notaDemoCodigo}>{codigoDemo}</Texto>
          </Texto>
        </View>
      )}

      <Botao aoTocar={confirmar} carregando={carregando} desabilitado={codigo.length < CASAS}>
        Confirmar código
      </Botao>
    </Tela>
  );
}

const estilos = StyleSheet.create({
  texto: {
    fontSize: typography.tamanho.apoio,
    color: colors.textoApoio,
    lineHeight: typography.tamanho.apoio * typography.altura.normal,
  },
  email: { color: colors.texto, fontWeight: typography.peso.forte },
  casas: { flexDirection: 'row', gap: spacing.pequeno },
  casa: {
    flex: 1,
    // O <input> do navegador tem largura mínima própria; sem isto as casas não
    // encolhem e as últimas saem da tela.
    minWidth: 0,
    height: 58,
    textAlign: 'center',
    fontSize: typography.tamanho.cabecalho,
    fontWeight: typography.peso.extra,
    color: colors.texto,
    backgroundColor: colors.cartao,
    borderRadius: radius.cartao,
    borderWidth: 1,
    borderColor: colors.borda,
  },
  casaPreenchida: { borderColor: colors.primaria },
  contagem: {
    fontSize: typography.tamanho.minuscula,
    color: colors.textoFraco,
    textAlign: 'center',
  },
  notaDemo: {
    backgroundColor: colors.bordaClara,
    borderRadius: radius.medio,
    padding: spacing.medio,
  },
  notaDemoTexto: {
    fontSize: typography.tamanho.minuscula,
    color: colors.textoApoio,
    textAlign: 'center',
  },
  notaDemoCodigo: {
    color: colors.texto,
    fontWeight: typography.peso.extra,
    letterSpacing: 2,
  },
});
