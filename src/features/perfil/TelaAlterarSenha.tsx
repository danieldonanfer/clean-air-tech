import { useState } from 'react';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import {
  Aviso,
  Botao,
  Cabecalho,
  Campo,
  Cartao,
  ForcaSenha,
  Icone,
  Rotulo,
  Tela,
  Texto,
} from '../../components';
import { useLarguraDaTela } from '../../hooks/useLarguraDaTela';
import { perfilService } from '../../services/perfilService';
import { colors, radius, spacing, typography } from '../../theme';
import { avaliarSenha } from '../../utils/senha';

/** Tela 16 — troca de senha de quem já está autenticado. */
export function TelaAlterarSenha() {
  const { amplo } = useLarguraDaTela();
  const [atual, setAtual] = useState('');
  const [nova, setNova] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  const pronta = atual.length > 0 && avaliarSenha(nova).valida && nova === confirmacao;

  async function salvar() {
    setErro(null);
    setOk(null);
    setSalvando(true);
    try {
      await perfilService.trocarSenha(atual, nova);
      setOk('Senha alterada com sucesso.');
      setAtual('');
      setNova('');
      setConfirmacao('');
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não foi possível alterar a senha.');
    } finally {
      setSalvando(false);
    }
  }

  const formulario = (
    <Cartao estilo={estilos.formulario}>
      <Rotulo>Trocar a senha</Rotulo>

      <View style={estilos.dica}>
        <Icone nome="escudo" tamanho={20} cor={colors.primaria} />
        <Texto style={estilos.dicaTexto}>
          Confirme a senha atual para validar sua identidade antes de cadastrar a nova.
        </Texto>
      </View>

      <Aviso>{erro}</Aviso>
      <Aviso tipo="sucesso">{ok}</Aviso>

      <Campo
        rotulo="Senha atual"
        valor={atual}
        aoMudar={setAtual}
        tipo="senha"
        icone="cadeado"
        apoio="Esqueci a senha?"
        aoTocarApoio={() => router.push('/esqueci-senha')}
      />
      <Campo rotulo="Nova senha" valor={nova} aoMudar={setNova} tipo="senha" icone="cadeado" />
      <Campo
        rotulo="Confirmar nova senha"
        valor={confirmacao}
        aoMudar={setConfirmacao}
        tipo="senha"
        icone="cadeado"
      />

      <View style={estilos.acoes}>
        <View style={estilos.metade}>
          <Botao aoTocar={salvar} carregando={salvando} desabilitado={!pronta}>
            Atualizar senha
          </Botao>
        </View>
        <View style={estilos.metade}>
          <Botao tipo="fantasma" aoTocar={() => router.replace('/configuracoes')}>
            Cancelar
          </Botao>
        </View>
      </View>
    </Cartao>
  );

  const requisitos = (
    <Cartao estilo={estilos.requisitos}>
      <Rotulo>Requisitos</Rotulo>
      <ForcaSenha senha={nova} confirmacao={confirmacao} />
    </Cartao>
  );

  return (
    <Tela>
      <Cabecalho titulo="Alterar senha" apoio="Segurança da conta" voltarPara="/configuracoes" />
      {amplo ? (
        <View style={estilos.colunas}>
          <View style={estilos.colunaPrincipal}>{formulario}</View>
          <View style={estilos.colunaLateral}>{requisitos}</View>
        </View>
      ) : (
        <>
          {formulario}
          {requisitos}
        </>
      )}
    </Tela>
  );
}

const estilos = StyleSheet.create({
  colunas: { flexDirection: 'row', gap: spacing.grande, alignItems: 'flex-start' },
  colunaPrincipal: { flex: 1 },
  colunaLateral: { width: 320 },
  formulario: { gap: spacing.medio },
  requisitos: { gap: spacing.medio },
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
  acoes: { flexDirection: 'row', gap: spacing.medio, marginTop: spacing.pequeno },
  metade: { flex: 1 },
});
