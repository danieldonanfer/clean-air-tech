import { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icone, Texto, EntradaTexto } from '../../components';
import { assistenteService } from '../../services/assistenteService';
import { alvoToqueMinimo, colors, radius, spacing, typography } from '../../theme';

interface Mensagem {
  id: string;
  de: 'usuario' | 'assistente';
  texto: string;
}

const ABERTURA: Mensagem = {
  id: 'abertura',
  de: 'assistente',
  texto:
    'Olá! Sou o assistente do CleanAirTech. Posso explicar o que os sensores estão medindo agora e o que fazer com isso.',
};

/**
 * Tela 13 — o assistente de aconselhamento.
 *
 * Não usa o container `Tela`: a conversa controla a própria altura, com a lista
 * rolando e o campo de digitação fixo embaixo, que é o comportamento esperado de
 * um chat em qualquer plataforma.
 */
export function TelaAssistente() {
  const margens = useSafeAreaInsets();
  const [mensagens, setMensagens] = useState<Mensagem[]>([ABERTURA]);
  const [texto, setTexto] = useState('');
  const [pensando, setPensando] = useState(false);
  const lista = useRef<FlatList<Mensagem>>(null);

  useEffect(() => {
    lista.current?.scrollToEnd({ animated: true });
  }, [mensagens, pensando]);

  async function enviar(pergunta?: string) {
    const conteudo = (pergunta ?? texto).trim();
    if (!conteudo || pensando) return;

    setMensagens((m) => [...m, { id: `u-${Date.now()}`, de: 'usuario', texto: conteudo }]);
    setTexto('');
    setPensando(true);
    try {
      const { resposta } = await assistenteService.perguntar(conteudo);
      setMensagens((m) => [...m, { id: `a-${Date.now()}`, de: 'assistente', texto: resposta }]);
    } catch {
      setMensagens((m) => [
        ...m,
        {
          id: `e-${Date.now()}`,
          de: 'assistente',
          texto: 'Não consegui falar com o aparelho agora. Tente de novo em instantes.',
        },
      ]);
    } finally {
      setPensando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={[estilos.fundo, { paddingTop: margens.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={estilos.topo}>
        <View style={estilos.marca}>
          <Icone nome="marca" tamanho={22} cor={colors.cartao} traco={2.4} />
        </View>
        <View style={estilos.topoTextos}>
          <Texto style={estilos.titulo}>Assistente</Texto>
          <View style={estilos.estado}>
            <View style={estilos.ponto} />
            <Texto style={estilos.estadoTexto}>Conectado ao aparelho</Texto>
          </View>
        </View>
      </View>

      <FlatList
        ref={lista}
        data={mensagens}
        keyExtractor={(m) => m.id}
        contentContainerStyle={estilos.conversa}
        renderItem={({ item }) => <Balao mensagem={item} />}
        ListFooterComponent={pensando ? <Pensando /> : null}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={estilos.sugestoesRolagem}
        contentContainerStyle={estilos.sugestoes}
      >
        {assistenteService.sugestoes().map((s) => (
          <Pressable
            key={s}
            onPress={() => void enviar(s)}
            accessibilityRole="button"
            accessibilityLabel={s}
            style={estilos.sugestao}
          >
            <Texto style={estilos.sugestaoTexto}>{s}</Texto>
          </Pressable>
        ))}
      </ScrollView>

      <View style={[estilos.rodape, { paddingBottom: spacing.medio + margens.bottom }]}>
        <EntradaTexto
          value={texto}
          onChangeText={setTexto}
          onSubmitEditing={() => void enviar()}
          placeholder="Pergunte ou comande ao CleanAirTech…"
          placeholderTextColor={colors.textoTenue}
          accessibilityLabel="Sua pergunta"
          returnKeyType="send"
          style={estilos.entrada}
        />
        <Pressable
          onPress={() => void enviar()}
          accessibilityRole="button"
          accessibilityLabel="Enviar a pergunta"
          style={estilos.enviar}
        >
          <Icone nome="enviar" tamanho={20} cor={colors.cartao} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

function Balao({ mensagem }: { mensagem: Mensagem }) {
  const meu = mensagem.de === 'usuario';
  return (
    <View style={[estilos.balao, meu ? estilos.balaoMeu : estilos.balaoDele]}>
      <Texto style={[estilos.balaoTexto, meu && estilos.balaoTextoMeu]}>{mensagem.texto}</Texto>
    </View>
  );
}

function Pensando() {
  return (
    <View
      style={estilos.pensando}
      accessibilityRole="progressbar"
      accessibilityLabel="Lendo os sensores"
    >
      <Texto style={estilos.pensandoTexto}>lendo os sensores…</Texto>
    </View>
  );
}

const estilos = StyleSheet.create({
  fundo: { flex: 1, backgroundColor: colors.fundo },
  topo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.medio,
    paddingHorizontal: spacing.grande,
    paddingVertical: spacing.medio,
    backgroundColor: colors.cartao,
    borderBottomWidth: 1,
    borderBottomColor: colors.bordaCartao,
  },
  marca: {
    width: 42,
    height: 42,
    borderRadius: radius.cartao,
    backgroundColor: colors.primaria,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topoTextos: { flex: 1, gap: spacing.micro },
  titulo: {
    fontSize: typography.tamanho.titulo,
    fontWeight: typography.peso.extra,
    color: colors.texto,
  },
  estado: { flexDirection: 'row', alignItems: 'center', gap: spacing.mini + 1 },
  ponto: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.sucessoForte },
  estadoTexto: {
    fontSize: typography.tamanho.mini,
    fontWeight: typography.peso.semi,
    color: colors.sucesso,
  },

  conversa: {
    padding: spacing.grande,
    gap: spacing.medio,
    maxWidth: 760,
    width: '100%',
    alignSelf: 'center',
  },
  balao: { maxWidth: '82%', padding: spacing.medio + 2, borderWidth: 1 },
  balaoDele: {
    alignSelf: 'flex-start',
    backgroundColor: colors.cartao,
    borderColor: colors.bordaClara,
    borderTopLeftRadius: radius.painel,
    borderTopRightRadius: radius.painel,
    borderBottomRightRadius: radius.painel,
    borderBottomLeftRadius: 4,
  },
  balaoMeu: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primaria,
    borderColor: colors.primaria,
    borderTopLeftRadius: radius.painel,
    borderTopRightRadius: radius.painel,
    borderBottomLeftRadius: radius.painel,
    borderBottomRightRadius: 4,
  },
  balaoTexto: {
    fontSize: typography.tamanho.corpo,
    lineHeight: typography.tamanho.corpo * typography.altura.normal,
    fontWeight: typography.peso.medio,
    color: colors.textoForte,
  },
  balaoTextoMeu: { color: colors.cartao },
  pensando: { alignSelf: 'flex-start', paddingVertical: spacing.pequeno },
  pensandoTexto: { fontSize: typography.tamanho.minuscula, color: colors.textoFraco },

  // O ScrollView cresce por padrão; sem isso ele divide a altura com a conversa
  // e os chips ficam esticados na vertical.
  sugestoesRolagem: { flexGrow: 0, flexShrink: 0 },
  sugestoes: {
    paddingHorizontal: spacing.grande,
    paddingBottom: spacing.medio,
    gap: spacing.pequeno,
  },
  sugestao: {
    paddingVertical: spacing.pequeno,
    paddingHorizontal: spacing.padrao,
    borderRadius: radius.pilula,
    backgroundColor: colors.cartao,
    borderWidth: 1,
    borderColor: colors.borda,
  },
  sugestaoTexto: {
    fontSize: typography.tamanho.minuscula,
    fontWeight: typography.peso.semi,
    color: colors.textoMedio,
  },

  rodape: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.pequeno,
    paddingHorizontal: spacing.grande,
  },
  entrada: {
    flex: 1,
    minHeight: alvoToqueMinimo + 4,
    paddingHorizontal: spacing.padrao,
    borderRadius: radius.pilula,
    backgroundColor: colors.cartao,
    borderWidth: 1,
    borderColor: colors.borda,
    fontSize: typography.tamanho.corpoGrande,
    color: colors.texto,
  },
  enviar: {
    width: alvoToqueMinimo + 4,
    height: alvoToqueMinimo + 4,
    borderRadius: radius.pilula,
    backgroundColor: colors.primaria,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
