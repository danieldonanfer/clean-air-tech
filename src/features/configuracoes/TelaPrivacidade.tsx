import { useState } from 'react';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import {
  Aviso,
  Botao,
  Cabecalho,
  Campo,
  Cartao,
  Dialogo,
  LinhaMenu,
  Rotulo,
  Tela,
  Texto,
} from '../../components';
import { useLarguraDaTela } from '../../hooks/useLarguraDaTela';
import { perfilService } from '../../services/perfilService';
import { useSessao } from '../../store/sessao';
import { colors, spacing, typography } from '../../theme';

const ITENS = [
  {
    icone: 'cadeado' as const,
    titulo: 'Alterar senha',
    apoio: 'Trocar a senha de acesso',
    destino: '/alterar-senha',
  },
  {
    icone: 'sino' as const,
    titulo: 'Alertas críticos de poluentes',
    apoio: 'Ativado para PM2.5 e CO₂',
    destino: undefined,
  },
  {
    icone: 'escudo' as const,
    titulo: 'Dados coletados',
    apoio: 'Medições cifradas em trânsito e em repouso',
    destino: undefined,
  },
];

/**
 * Tela 17 — privacidade e segurança.
 *
 * A exclusão exige confirmação dupla: digitar a palavra EXCLUIR e informar a
 * senha atual. Uma ação irreversível não deve depender de um único toque.
 */
export function TelaPrivacidade() {
  const { amplo } = useLarguraDaTela();
  const { sair } = useSessao();
  const [abrindoExclusao, setAbrindoExclusao] = useState(false);
  const [confirmacao, setConfirmacao] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [excluindo, setExcluindo] = useState(false);

  async function excluir() {
    setErro(null);
    setExcluindo(true);
    try {
      await perfilService.excluirConta(confirmacao, senha);
      sair();
      router.replace('/');
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não foi possível excluir a conta.');
    } finally {
      setExcluindo(false);
    }
  }

  const lista = (
    <View style={estilos.lista}>
      <Rotulo>Segurança da conta</Rotulo>
      {ITENS.map((item) => (
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

  const zonaDePerigo = (
    <Cartao estilo={estilos.perigo}>
      <Rotulo>Gerenciamento de conta</Rotulo>
      <Texto style={estilos.tituloPerigo}>Excluir conta permanentemente</Texto>
      <Texto style={estilos.textoPerigo}>
        Apaga seus dados pessoais, todo o histórico do ambiente e desvincula os aparelhos. Não é
        possível desfazer.
      </Texto>
      <Botao tipo="perigo" aoTocar={() => setAbrindoExclusao(true)}>
        Excluir conta
      </Botao>
    </Cartao>
  );

  return (
    <Tela>
      <Cabecalho
        titulo="Privacidade e segurança"
        apoio="Dados coletados, alertas e conta"
        voltarPara="/configuracoes"
      />

      {amplo ? (
        <View style={estilos.colunas}>
          <View style={estilos.coluna}>{lista}</View>
          <View style={estilos.coluna}>{zonaDePerigo}</View>
        </View>
      ) : (
        <>
          {lista}
          {zonaDePerigo}
        </>
      )}

      <Dialogo
        aberto={abrindoExclusao}
        icone="lixeira"
        corIcone={colors.perigo}
        fundoIcone={colors.perigoFundo}
        titulo="Excluir conta permanentemente?"
        texto="Isso apaga seus dados pessoais, todo o histórico do ambiente e desvincula os aparelhos."
        aoFechar={() => setAbrindoExclusao(false)}
        acoes={
          <>
            <View style={estilos.metade}>
              <Botao tipo="secundario" aoTocar={() => setAbrindoExclusao(false)}>
                Cancelar
              </Botao>
            </View>
            <View style={estilos.metade}>
              <Botao
                tipo="perigo"
                carregando={excluindo}
                desabilitado={confirmacao.trim().toUpperCase() !== 'EXCLUIR' || senha.length === 0}
                aoTocar={excluir}
              >
                Excluir
              </Botao>
            </View>
          </>
        }
      >
        <View style={estilos.camposDoDialogo}>
          <Aviso>{erro}</Aviso>
          <Campo
            rotulo="Digite EXCLUIR para confirmar"
            valor={confirmacao}
            aoMudar={setConfirmacao}
            dica="EXCLUIR"
          />
          <Campo
            rotulo="Senha atual"
            valor={senha}
            aoMudar={setSenha}
            tipo="senha"
            icone="cadeado"
          />
        </View>
      </Dialogo>
    </Tela>
  );
}

const estilos = StyleSheet.create({
  colunas: { flexDirection: 'row', gap: spacing.grande, alignItems: 'flex-start' },
  coluna: { flex: 1, gap: spacing.padrao },
  lista: { gap: spacing.medio },
  perigo: {
    borderColor: colors.perigoBorda,
    backgroundColor: colors.perigoFundoSuave,
    gap: spacing.pequeno,
  },
  tituloPerigo: {
    fontSize: typography.tamanho.corpoGrande,
    fontWeight: typography.peso.extra,
    color: colors.perigo,
    marginTop: spacing.pequeno,
  },
  textoPerigo: {
    fontSize: typography.tamanho.pequena,
    color: colors.textoApoio,
    lineHeight: typography.tamanho.pequena * typography.altura.normal,
    marginBottom: spacing.pequeno,
  },
  camposDoDialogo: { width: '100%', gap: spacing.medio, marginTop: spacing.pequeno },
  metade: { flex: 1 },
});
