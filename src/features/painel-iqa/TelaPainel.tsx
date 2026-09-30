import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AnelIQA, Carregando, Cartao, Icone, Rotulo, Tela, Texto } from '../../components';
import { useLarguraDaTela } from '../../hooks/useLarguraDaTela';
import { arService } from '../../services/arService';
import { dispositivoService } from '../../services/dispositivoService';
import { useSessao } from '../../store/sessao';
import { colors, radius, spacing, typography } from '../../theme';
import type { Dispositivo, Leitura, PontoDoDia } from '../../types/ar';
import { numero } from '../../utils/formato';
import { classificarIQA } from '../../utils/iqa';
import { CartaoSensor, type CartaoSensorProps } from './componentes/CartaoSensor';
import { FaixaDeHoras } from './componentes/FaixaDeHoras';

/** Intervalo de atualização do painel, em milissegundos. */
const RITMO_MS = 6000;

/** Tela 9 — painel em tempo real. */
export function TelaPainel() {
  const { usuario } = useSessao();
  const { amplo } = useLarguraDaTela();
  const [leitura, setLeitura] = useState<Leitura | null>(null);
  const [horas, setHoras] = useState<PontoDoDia[]>([]);
  const [aparelho, setAparelho] = useState<Dispositivo | null>(null);

  useEffect(() => {
    let vivo = true;

    async function carregar() {
      const [l, h, d] = await Promise.all([
        arService.leituraAgora(),
        arService.leiturasDoDia(),
        dispositivoService.atual(),
      ]);
      if (!vivo) return;
      setLeitura(l);
      setHoras(h);
      setAparelho(d);
    }

    void carregar();
    const relogio = setInterval(() => void carregar(), RITMO_MS);
    return () => {
      vivo = false;
      clearInterval(relogio);
    };
  }, []);

  if (!leitura) return <Carregando texto="Conectando ao aparelho…" />;

  const faixa = classificarIQA(leitura.iqa);

  const sensores: CartaoSensorProps[] = [
    {
      nome: 'PM2.5',
      apoio: 'Partículas finas',
      valor: numero(leitura.pm25),
      unidade: 'µg/m³',
      bruto: leitura.pm25,
      limite: 15,
    },
    {
      nome: 'PM10',
      apoio: 'Poeira inalável',
      valor: numero(leitura.pm10),
      unidade: 'µg/m³',
      bruto: leitura.pm10,
      limite: 45,
    },
    {
      nome: 'CO₂',
      apoio: 'Dióxido de carbono',
      valor: String(leitura.co2),
      unidade: 'ppm',
      bruto: leitura.co2,
      limite: 1000,
    },
    {
      nome: 'COVs',
      apoio: 'Compostos orgânicos',
      valor: numero(leitura.covs, 2),
      unidade: 'mg/m³',
      bruto: leitura.covs,
      limite: 0.5,
    },
    {
      nome: 'Temperatura',
      apoio: 'Conforto térmico',
      valor: numero(leitura.temperatura),
      unidade: '°C',
    },
    { nome: 'Umidade', apoio: 'Umidade relativa', valor: String(leitura.umidade), unidade: '%' },
  ];

  const cartaoDoIndice = (
    <Cartao estilo={estilos.indice}>
      <View style={estilos.topoIndice}>
        <Rotulo>Qualidade geral do ar</Rotulo>
        <View style={estilos.aoVivo}>
          <View style={estilos.ponto} />
          <Texto style={estilos.aoVivoTexto}>Em tempo real</Texto>
        </View>
      </View>

      <AnelIQA valor={leitura.iqa} tamanho={amplo ? 184 : 156} />

      <View style={[estilos.pilula, { backgroundColor: faixa.fundo }]}>
        <Icone nome="visto" tamanho={14} cor={faixa.texto} traco={3} />
        <Texto style={[estilos.pilulaTexto, { color: faixa.texto }]}>{faixa.rotulo}</Texto>
      </View>

      <Texto style={estilos.recomendacao}>{recomendar(leitura)}</Texto>
    </Cartao>
  );

  const cartoesDoAparelho = (
    <View style={estilos.duplo}>
      <Cartao estilo={estilos.resumo}>
        <Texto style={estilos.resumoRotulo}>Purificação ativa</Texto>
        <Texto style={estilos.resumoValor}>Filtro HEPA H13</Texto>
        <Texto style={estilos.resumoDestaque}>
          {aparelho ? `${aparelho.filtro.vidaRestante}% de vida útil` : '—'}
        </Texto>
      </Cartao>
      <Cartao estilo={estilos.resumo}>
        <Texto style={estilos.resumoRotulo}>Aparelho</Texto>
        <Texto style={estilos.resumoValor}>{aparelho?.serie ?? '—'}</Texto>
        <View style={estilos.aoVivo}>
          <View style={estilos.ponto} />
          <Texto style={estilos.aoVivoTexto}>Online</Texto>
        </View>
      </Cartao>
    </View>
  );

  const listaDeSensores = (
    <>
      <View style={estilos.tituloSecao}>
        <Texto style={estilos.secao}>Sensores de ambiente</Texto>
        <Texto style={estilos.contagem}>{sensores.length} sensores</Texto>
      </View>
      <View style={estilos.grade}>
        {sensores.map((s) => (
          <CartaoSensor key={s.nome} {...s} />
        ))}
      </View>
    </>
  );

  return (
    <Tela>
      <View style={estilos.saudacao}>
        <View style={estilos.avatar}>
          <Icone nome="usuario" tamanho={22} cor={colors.primaria} />
        </View>
        <View style={estilos.saudacaoTextos}>
          <Texto style={estilos.ola}>Olá, {usuario?.apelido ?? 'visitante'}</Texto>
          <Texto style={estilos.comodo}>{aparelho?.comodo ?? 'Ambiente'}</Texto>
        </View>
      </View>

      {amplo ? (
        <View style={estilos.colunas}>
          <View style={estilos.colunaEsquerda}>
            {cartaoDoIndice}
            {cartoesDoAparelho}
          </View>
          <View style={estilos.colunaDireita}>
            {horas.length > 0 && <FaixaDeHoras pontos={horas} />}
            {listaDeSensores}
          </View>
        </View>
      ) : (
        <>
          {cartaoDoIndice}
          {cartoesDoAparelho}
          {horas.length > 0 && <FaixaDeHoras pontos={horas} />}
          {listaDeSensores}
        </>
      )}
    </Tela>
  );
}

/** A recomendação nomeia o poluente que está mandando no índice. */
function recomendar(leitura: Leitura): string {
  if (leitura.co2 > 900) return 'O CO₂ está alto. Abrir uma janela por dez minutos resolve.';
  if (leitura.pm25 > 15)
    return 'Partículas finas acima do limite da OMS. A purificação foi reforçada.';
  return 'O ar interior está limpo e ideal para respiração saudável.';
}

const estilos = StyleSheet.create({
  saudacao: { flexDirection: 'row', alignItems: 'center', gap: spacing.medio },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: radius.pilula,
    backgroundColor: colors.primariaSuaveAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saudacaoTextos: { flex: 1, gap: spacing.micro },
  ola: {
    fontSize: typography.tamanho.tituloGrande,
    fontWeight: typography.peso.extra,
    color: colors.texto,
    letterSpacing: -0.4,
  },
  comodo: { fontSize: typography.tamanho.minuscula, color: colors.textoFraco },

  colunas: { flexDirection: 'row', gap: spacing.grande, alignItems: 'flex-start' },
  colunaEsquerda: { width: 360, gap: spacing.padrao },
  colunaDireita: { flex: 1, gap: spacing.padrao },

  indice: { alignItems: 'center', gap: spacing.medio, padding: spacing.grande },
  topoIndice: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aoVivo: { flexDirection: 'row', alignItems: 'center', gap: spacing.mini + 1 },
  ponto: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.sucessoForte },
  aoVivoTexto: {
    fontSize: typography.tamanho.mini,
    fontWeight: typography.peso.forte,
    color: colors.sucesso,
  },
  pilula: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.mini + 2,
    borderRadius: radius.pilula,
    paddingVertical: spacing.pequeno - 2,
    paddingHorizontal: spacing.padrao,
  },
  pilulaTexto: { fontSize: typography.tamanho.apoio, fontWeight: typography.peso.extra },
  recomendacao: {
    fontSize: typography.tamanho.pequena,
    color: colors.textoApoio,
    textAlign: 'center',
    lineHeight: typography.tamanho.pequena * typography.altura.normal,
  },

  duplo: { flexDirection: 'row', gap: spacing.medio },
  resumo: { flex: 1, padding: spacing.medio + 2, gap: spacing.micro },
  resumoRotulo: {
    fontSize: typography.tamanho.micro,
    fontWeight: typography.peso.forte,
    color: colors.textoFraco,
  },
  resumoValor: {
    fontSize: typography.tamanho.apoio,
    fontWeight: typography.peso.extra,
    color: colors.texto,
    marginTop: spacing.mini,
  },
  resumoDestaque: {
    fontSize: typography.tamanho.mini,
    fontWeight: typography.peso.forte,
    color: colors.primaria,
  },

  tituloSecao: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  secao: {
    fontSize: typography.tamanho.destaque,
    fontWeight: typography.peso.extra,
    color: colors.texto,
    letterSpacing: -0.3,
  },
  contagem: { fontSize: typography.tamanho.mini, color: colors.textoFraco },
  grade: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.medio },
});
