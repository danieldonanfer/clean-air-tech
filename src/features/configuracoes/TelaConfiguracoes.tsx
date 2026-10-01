import { useState } from 'react';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import {
  Botao,
  Cabecalho,
  Cartao,
  Dialogo,
  Icone,
  LinhaMenu,
  Rotulo,
  Tela,
  Texto,
} from '../../components';
import { useLarguraDaTela } from '../../hooks/useLarguraDaTela';
import { useSessao } from '../../store/sessao';
import { colors, radius, spacing, typography } from '../../theme';

/** Itens sem destino ainda não têm tela — ficam sem seta, e não como link morto. */
const PREFERENCIAS = [
  {
    icone: 'aparelho' as const,
    titulo: 'Ar condicionado e ambiente',
    apoio: 'Casa · 22 °C · automação ativada',
    destino: undefined,
  },
  {
    icone: 'sino' as const,
    titulo: 'Alertas e limites',
    apoio: 'PM2.5, CO₂ e tipos de notificação',
    destino: undefined,
  },
  {
    icone: 'escudo' as const,
    titulo: 'Privacidade e segurança',
    apoio: 'Gerenciar dados coletados e histórico',
    destino: '/privacidade',
  },
  {
    icone: 'cadeado' as const,
    titulo: 'Alterar senha',
    apoio: 'Trocar a senha de acesso da conta',
    destino: '/alterar-senha',
  },
];

/** Tela 14 — configurações. */
export function TelaConfiguracoes() {
  const { amplo } = useLarguraDaTela();
  const { usuario, sair } = useSessao();
  const [confirmandoSaida, setConfirmandoSaida] = useState(false);

  const cartaoDaConta = (
    <Cartao>
      <Rotulo>Conta</Rotulo>
      <View style={estilos.conta}>
        <View style={estilos.avatar}>
          <Icone nome="usuario" tamanho={24} cor={colors.primaria} />
        </View>
        <View style={estilos.contaTextos}>
          <Texto style={estilos.nome}>{usuario?.nome ?? '—'}</Texto>
          <Texto style={estilos.email} numberOfLines={1}>
            {usuario?.email ?? '—'}
          </Texto>
        </View>
      </View>
      <View style={estilos.acaoConta}>
        <Botao tipo="secundario" aoTocar={() => router.push('/perfil')}>
          Editar dados pessoais
        </Botao>
      </View>
    </Cartao>
  );

  const cartaoDaSessao = (
    <Cartao estilo={estilos.cartaoSessao}>
      <Rotulo>Sessão</Rotulo>
      <Texto style={estilos.explicacao}>
        Encerrar a sessão não afeta os aparelhos vinculados nem o histórico já registrado.
      </Texto>
      <Botao tipo="perigo" aoTocar={() => setConfirmandoSaida(true)}>
        Encerrar sessão
      </Botao>
      <Texto style={estilos.versao}>CleanAirTech · protótipo de telas</Texto>
    </Cartao>
  );

  const listaDePreferencias = (
    <View style={estilos.lista}>
      <Rotulo>Preferências</Rotulo>
      {PREFERENCIAS.map((item) => (
        <LinhaMenu
          key={item.titulo}
          icone={item.icone}
          titulo={item.titulo}
          apoio={item.apoio}
          aoTocar={item.destino ? () => router.push(item.destino) : undefined}
        />
      ))}
    </View>
  );

  return (
    <Tela>
      <Cabecalho titulo="Configurações" apoio="Conta, preferências e segurança" />

      {amplo ? (
        <View style={estilos.colunas}>
          <View style={estilos.coluna}>
            {cartaoDaConta}
            {cartaoDaSessao}
          </View>
          <View style={estilos.coluna}>{listaDePreferencias}</View>
        </View>
      ) : (
        <>
          {cartaoDaConta}
          {listaDePreferencias}
          {cartaoDaSessao}
        </>
      )}

      <Dialogo
        aberto={confirmandoSaida}
        icone="sair"
        titulo="Deseja realmente sair?"
        texto="Você vai precisar entrar de novo com e-mail e senha para acompanhar o ambiente."
        aoFechar={() => setConfirmandoSaida(false)}
        acoes={
          <>
            <View style={estilos.metade}>
              <Botao tipo="secundario" aoTocar={() => setConfirmandoSaida(false)}>
                Cancelar
              </Botao>
            </View>
            <View style={estilos.metade}>
              <Botao
                aoTocar={() => {
                  setConfirmandoSaida(false);
                  sair();
                  router.replace('/');
                }}
              >
                Sair
              </Botao>
            </View>
          </>
        }
      />
    </Tela>
  );
}

const estilos = StyleSheet.create({
  colunas: { flexDirection: 'row', gap: spacing.grande, alignItems: 'flex-start' },
  coluna: { flex: 1, gap: spacing.padrao },
  lista: { gap: spacing.medio },

  conta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.medio,
    marginTop: spacing.medio,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: radius.pilula,
    backgroundColor: colors.primariaSuaveAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contaTextos: { flex: 1, gap: spacing.micro },
  nome: {
    fontSize: typography.tamanho.titulo,
    fontWeight: typography.peso.extra,
    color: colors.texto,
  },
  email: { fontSize: typography.tamanho.apoio, color: colors.textoFraco },
  acaoConta: { marginTop: spacing.padrao },

  cartaoSessao: { borderColor: colors.perigoBorda, gap: spacing.medio },
  explicacao: {
    fontSize: typography.tamanho.pequena,
    color: colors.textoApoio,
    lineHeight: typography.tamanho.pequena * typography.altura.normal,
  },
  versao: { fontSize: typography.tamanho.mini, color: colors.textoTenue },

  metade: { flex: 1 },
});
