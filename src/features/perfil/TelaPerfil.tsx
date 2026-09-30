import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import {
  Aviso,
  Botao,
  Cabecalho,
  Campo,
  Carregando,
  Cartao,
  Rotulo,
  Tela,
  Texto,
} from '../../components';
import { useLarguraDaTela } from '../../hooks/useLarguraDaTela';
import { perfilService } from '../../services/perfilService';
import { useSessao } from '../../store/sessao';
import { colors, spacing, typography } from '../../theme';
import type { Usuario } from '../../types/usuario';

/** Tela 15 — dados pessoais. */
export function TelaPerfil() {
  const { amplo } = useLarguraDaTela();
  const { atualizarUsuario } = useSessao();
  const [dados, setDados] = useState<Usuario | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [salvo, setSalvo] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    void perfilService.carregar().then(setDados);
  }, []);

  async function salvar() {
    if (!dados) return;
    setErro(null);
    setSalvo(null);
    setSalvando(true);
    try {
      const atualizado = await perfilService.salvar({
        nome: dados.nome,
        apelido: dados.apelido,
        email: dados.email,
        telefone: dados.telefone,
      });
      atualizarUsuario(atualizado);
      setSalvo('Perfil atualizado com sucesso.');
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não foi possível salvar.');
    } finally {
      setSalvando(false);
    }
  }

  if (!dados) return <Carregando texto="Carregando o perfil…" />;

  const mudar = (campo: keyof Usuario) => (valor: string) => setDados({ ...dados, [campo]: valor });

  const formulario = (
    <Cartao estilo={estilos.formulario}>
      <Rotulo>Dados pessoais</Rotulo>
      <Aviso>{erro}</Aviso>
      <Aviso tipo="sucesso">{salvo}</Aviso>

      <Campo rotulo="Nome completo" valor={dados.nome} aoMudar={mudar('nome')} icone="usuario" />
      <Campo
        rotulo="Como deseja ser chamada"
        valor={dados.apelido}
        aoMudar={mudar('apelido')}
        icone="usuario"
      />
      <Campo
        rotulo="E-mail"
        valor={dados.email}
        aoMudar={mudar('email')}
        tipo="email"
        icone="email"
      />
      <Campo
        rotulo="Telefone"
        valor={dados.telefone}
        aoMudar={mudar('telefone')}
        tipo="telefone"
        icone="aparelho"
      />

      <View style={estilos.acoes}>
        <View style={estilos.metade}>
          <Botao aoTocar={salvar} carregando={salvando}>
            Salvar alterações
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

  const lateral = (
    <View style={estilos.coluna}>
      <Cartao>
        <Rotulo>Membro desde</Rotulo>
        <Texto style={estilos.destaque}>{dados.membroDesde}</Texto>
        <Texto style={estilos.apoio}>{dados.funcao}</Texto>
      </Cartao>
      <Cartao estilo={estilos.cartaoSeguranca}>
        <Rotulo>Segurança</Rotulo>
        <Texto style={estilos.apoio}>
          A senha não aparece aqui. Para trocá-la é preciso confirmar a senha atual.
        </Texto>
        <Botao tipo="secundario" aoTocar={() => router.push('/alterar-senha')}>
          Alterar senha
        </Botao>
      </Cartao>
    </View>
  );

  return (
    <Tela>
      <Cabecalho titulo="Perfil" apoio="Dados pessoais da conta" voltarPara="/configuracoes" />
      {amplo ? (
        <View style={estilos.colunas}>
          <View style={estilos.colunaPrincipal}>{formulario}</View>
          {lateral}
        </View>
      ) : (
        <>
          {formulario}
          {lateral}
        </>
      )}
    </Tela>
  );
}

const estilos = StyleSheet.create({
  colunas: { flexDirection: 'row', gap: spacing.grande, alignItems: 'flex-start' },
  colunaPrincipal: { flex: 1 },
  coluna: { width: undefined, gap: spacing.padrao, maxWidth: 340, flexGrow: 1 },
  formulario: { gap: spacing.medio },
  acoes: { flexDirection: 'row', gap: spacing.medio, marginTop: spacing.pequeno },
  metade: { flex: 1 },
  destaque: {
    fontSize: typography.tamanho.titulo,
    fontWeight: typography.peso.extra,
    color: colors.texto,
    marginTop: spacing.mini,
  },
  apoio: {
    fontSize: typography.tamanho.pequena,
    color: colors.textoApoio,
    lineHeight: typography.tamanho.pequena * typography.altura.normal,
  },
  cartaoSeguranca: { gap: spacing.medio },
});
