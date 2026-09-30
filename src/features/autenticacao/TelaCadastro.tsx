import { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import {
  Aviso,
  Botao,
  Cabecalho,
  Campo,
  Cartao,
  ForcaSenha,
  Icone,
  Passos,
  Tela,
  type NomeDeIcone,
  Texto,
} from '../../components';
import { authService } from '../../services/authService';
import { useSessao } from '../../store/sessao';
import { colors, radius, spacing, typography } from '../../theme';
import { avaliarSenha } from '../../utils/senha';

/**
 * Telas 5 a 8 — o cadastro em quatro etapas.
 *
 * Cada etapa cuida de um assunto só: dados da pessoa, senha, onde o aparelho vai
 * ficar e, por fim, o motivo de uso com o aceite dos termos. Na revisão do
 * protótipo a primeira etapa misturava dados pessoais com pareamento de
 * aparelho — aqui isso ficou separado.
 */
const COMODOS = ['Sala de estar', 'Quarto', 'Cozinha', 'Escritório'];

const OBJETIVOS: { chave: string; titulo: string; apoio: string; icone: NomeDeIcone }[] = [
  {
    chave: 'ar',
    titulo: 'Monitoramento de ar e poluentes',
    apoio: 'Acompanhe IQA, PM2.5, COVs e CO₂ em tempo real',
    icone: 'marca',
  },
  {
    chave: 'alergia',
    titulo: 'Controle de alergias e asma',
    apoio: 'Alertas mais sensíveis a ácaros e poeira fina',
    icone: 'escudo',
  },
  {
    chave: 'conforto',
    titulo: 'Conforto e automação',
    apoio: 'Rotinas de ventilação junto com a casa conectada',
    icone: 'engrenagem',
  },
  {
    chave: 'outro',
    titulo: 'Outro objetivo',
    apoio: 'Você pode reconfigurar isso quando quiser',
    icone: 'usuario',
  },
];

const ROTULOS: Record<number, string> = {
  1: 'Dados pessoais',
  2: 'Segurança',
  3: 'Ambiente',
  4: 'Finalização',
};

export function TelaCadastro() {
  const { entrar } = useSessao();
  const [etapa, setEtapa] = useState(1);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [comodo, setComodo] = useState(COMODOS[0]);
  const [objetivo, setObjetivo] = useState('ar');
  const [aceitouTermos, setAceitouTermos] = useState(false);

  const podeAvancar =
    (etapa === 1 && nome.trim().length > 2 && /.+@.+\..+/.test(email)) ||
    (etapa === 2 && avaliarSenha(senha).valida && senha === confirmacao) ||
    (etapa === 3 && Boolean(comodo)) ||
    (etapa === 4 && aceitouTermos);

  async function finalizar() {
    setErro(null);
    setCarregando(true);
    try {
      const sessao = await authService.cadastrar({
        nome,
        email,
        telefone,
        senha,
        aceitouTermos,
        objetivo: OBJETIVOS.find((o) => o.chave === objetivo)?.titulo ?? '',
      });
      entrar(sessao);
      router.replace('/painel');
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não foi possível criar a conta.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <Tela estreita>
      <Cabecalho
        titulo="Criar conta"
        apoio="Configuração inicial"
        voltarPara={etapa === 1 ? '/' : undefined}
        direita={
          etapa > 1 ? (
            <Pressable
              onPress={() => setEtapa(etapa - 1)}
              accessibilityRole="button"
              accessibilityLabel="Voltar uma etapa"
            >
              <Texto style={estilos.link}>Voltar</Texto>
            </Pressable>
          ) : undefined
        }
      />

      <Passos atual={etapa} total={4} rotulo={ROTULOS[etapa]} />
      <Aviso>{erro}</Aviso>

      {etapa === 1 && (
        <>
          <Campo
            rotulo="Nome completo"
            valor={nome}
            aoMudar={setNome}
            icone="usuario"
            dica="como você se chama"
          />
          <Campo
            rotulo="E-mail"
            valor={email}
            aoMudar={setEmail}
            tipo="email"
            icone="email"
            dica="nome@gmail.com"
          />
          <Campo
            rotulo="Telefone (opcional)"
            valor={telefone}
            aoMudar={setTelefone}
            tipo="telefone"
            icone="aparelho"
            dica="+55 (11) 90000-0000"
          />
          <Texto style={estilos.nota}>
            Usamos o telefone só para alertas críticos de qualidade do ar e para recuperar a conta.
          </Texto>
        </>
      )}

      {etapa === 2 && (
        <>
          <Campo
            rotulo="Criar senha"
            valor={senha}
            aoMudar={setSenha}
            tipo="senha"
            icone="cadeado"
            dica="mínimo de 8 caracteres"
          />
          <ForcaSenha senha={senha} confirmacao={confirmacao} />
          <Campo
            rotulo="Confirmar senha"
            valor={confirmacao}
            aoMudar={setConfirmacao}
            tipo="senha"
            icone="cadeado"
            dica="repita a senha"
          />
        </>
      )}

      {etapa === 3 && (
        <>
          <Texto style={estilos.explicacao}>
            Onde o aparelho vai ficar? Isso define o nome que aparece no painel.
          </Texto>
          <View style={estilos.grade}>
            {COMODOS.map((c) => {
              const ativo = c === comodo;
              return (
                <Pressable
                  key={c}
                  onPress={() => setComodo(c)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: ativo }}
                  accessibilityLabel={c}
                  style={[estilos.opcaoComodo, ativo && estilos.opcaoAtiva]}
                >
                  <Icone
                    nome="local"
                    tamanho={22}
                    cor={ativo ? colors.primaria : colors.textoFraco}
                  />
                  <Texto style={[estilos.comodoTexto, ativo && estilos.comodoTextoAtivo]}>
                    {c}
                  </Texto>
                </Pressable>
              );
            })}
          </View>
        </>
      )}

      {etapa === 4 && (
        <>
          <Texto style={estilos.pergunta}>
            Qual é o seu principal objetivo com o CleanAirTech?
          </Texto>

          {OBJETIVOS.map((o) => {
            const ativo = o.chave === objetivo;
            return (
              <Cartao
                key={o.chave}
                aoTocar={() => setObjetivo(o.chave)}
                rotuloAcessivel={o.titulo}
                estilo={[estilos.objetivo, ativo && estilos.objetivoAtivo]}
              >
                <View style={estilos.linhaObjetivo}>
                  <View
                    style={[
                      estilos.molduraObjetivo,
                      { backgroundColor: ativo ? colors.primaria : colors.bordaClara },
                    ]}
                  >
                    <Icone
                      nome={o.icone}
                      tamanho={19}
                      cor={ativo ? colors.cartao : colors.textoFraco}
                    />
                  </View>
                  <View style={estilos.textosObjetivo}>
                    <Texto style={estilos.objetivoTitulo}>{o.titulo}</Texto>
                    <Texto style={estilos.objetivoApoio}>{o.apoio}</Texto>
                  </View>
                  <Icone
                    nome={ativo ? 'vistoCirculo' : 'circulo'}
                    tamanho={18}
                    cor={ativo ? colors.primaria : colors.textoTenue}
                  />
                </View>
              </Cartao>
            );
          })}

          <Pressable
            onPress={() => setAceitouTermos((a) => !a)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: aceitouTermos }}
            accessibilityLabel="Li e concordo com os Termos de Uso e a Política de Privacidade"
            style={estilos.aceite}
          >
            <View style={[estilos.caixinha, aceitouTermos && estilos.caixinhaMarcada]}>
              {aceitouTermos && <Icone nome="visto" tamanho={13} cor={colors.cartao} traco={3.5} />}
            </View>
            <Texto style={estilos.aceiteTexto}>
              Li e concordo com os <Texto style={estilos.link}>Termos de Uso</Texto> e a{' '}
              <Texto style={estilos.link}>Política de Privacidade</Texto>.
            </Texto>
          </Pressable>
        </>
      )}

      <View style={estilos.rodape}>
        {etapa < 4 ? (
          <Botao aoTocar={() => setEtapa(etapa + 1)} desabilitado={!podeAvancar}>
            Continuar
          </Botao>
        ) : (
          <Botao aoTocar={finalizar} carregando={carregando} desabilitado={!podeAvancar}>
            Finalizar cadastro
          </Botao>
        )}

        {etapa === 1 && (
          <View style={estilos.jaTemConta}>
            <Texto style={estilos.nota}>Já possui uma conta? </Texto>
            <Pressable
              onPress={() => router.replace('/')}
              accessibilityRole="link"
              accessibilityLabel="Entrar"
            >
              <Texto style={estilos.link}>Entrar</Texto>
            </Pressable>
          </View>
        )}
      </View>
    </Tela>
  );
}

const estilos = StyleSheet.create({
  link: {
    fontSize: typography.tamanho.apoio,
    fontWeight: typography.peso.forte,
    color: colors.primaria,
  },
  nota: {
    fontSize: typography.tamanho.minuscula,
    color: colors.textoFraco,
    lineHeight: typography.tamanho.minuscula * typography.altura.normal,
  },
  explicacao: {
    fontSize: typography.tamanho.apoio,
    color: colors.textoApoio,
    lineHeight: typography.tamanho.apoio * typography.altura.normal,
  },
  grade: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.medio },
  opcaoComodo: {
    flexGrow: 1,
    flexBasis: '45%',
    paddingVertical: spacing.padrao + 2,
    paddingHorizontal: spacing.medio,
    borderRadius: radius.painel,
    backgroundColor: colors.cartao,
    borderWidth: 1.5,
    borderColor: colors.borda,
    alignItems: 'center',
    gap: spacing.pequeno,
  },
  opcaoAtiva: { backgroundColor: colors.primariaSuave, borderColor: colors.primaria },
  comodoTexto: {
    fontSize: typography.tamanho.apoio,
    fontWeight: typography.peso.semi,
    color: colors.textoMedio,
  },
  comodoTextoAtivo: { fontWeight: typography.peso.forte, color: colors.primariaEscura },
  pergunta: {
    fontSize: typography.tamanho.destaque,
    fontWeight: typography.peso.extra,
    color: colors.texto,
    letterSpacing: -0.3,
  },
  objetivo: { padding: spacing.medio + 2, borderRadius: radius.cartao, borderWidth: 1.5 },
  objetivoAtivo: { borderColor: colors.primaria, backgroundColor: colors.primariaSuave },
  linhaObjetivo: { flexDirection: 'row', alignItems: 'center', gap: spacing.medio },
  molduraObjetivo: {
    width: 38,
    height: 38,
    borderRadius: radius.medio,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textosObjetivo: { flex: 1, gap: spacing.micro },
  objetivoTitulo: {
    fontSize: typography.tamanho.corpo,
    fontWeight: typography.peso.forte,
    color: colors.texto,
  },
  objetivoApoio: {
    fontSize: typography.tamanho.mini + 0.5,
    color: colors.textoFraco,
    lineHeight: (typography.tamanho.mini + 0.5) * typography.altura.normal,
  },
  aceite: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.medio },
  caixinha: {
    width: 22,
    height: 22,
    borderRadius: radius.pequeno - 2,
    borderWidth: 1.5,
    borderColor: colors.textoTenue,
    backgroundColor: colors.cartao,
    alignItems: 'center',
    justifyContent: 'center',
  },
  caixinhaMarcada: { backgroundColor: colors.primaria, borderColor: colors.primaria },
  aceiteTexto: {
    flex: 1,
    fontSize: typography.tamanho.minuscula,
    color: colors.textoMedio,
    lineHeight: typography.tamanho.minuscula * typography.altura.normal,
  },
  rodape: { marginTop: 'auto', paddingTop: spacing.medio, gap: spacing.medio },
  jaTemConta: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
});
