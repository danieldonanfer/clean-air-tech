import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Cabecalho, Carregando, Cartao, Rotulo, Tela, Texto } from '../../components';
import { useLarguraDaTela } from '../../hooks/useLarguraDaTela';
import { arService } from '../../services/arService';
import { colors, radius, spacing, typography } from '../../theme';
import type { Historico, PeriodoHistorico } from '../../types/ar';
import { numero } from '../../utils/formato';
import { classificarIQA } from '../../utils/iqa';
import { GraficoHistorico } from './componentes/GraficoHistorico';
import { MetricaChave } from './componentes/MetricaChave';

const PERIODOS: { chave: PeriodoHistorico; rotulo: string }[] = [
  { chave: '7d', rotulo: '7 dias' },
  { chave: '30d', rotulo: '30 dias' },
  { chave: '90d', rotulo: '90 dias' },
];

/**
 * Limites de referência das métricas mostradas. Os três valores vêm das mesmas
 * fontes usadas no cálculo do índice (OMS para PM2.5, conforto para CO₂ e COVs).
 */
const METRICAS = [
  {
    chave: 'pm25' as const,
    nome: 'PM2.5 (partículas finas)',
    unidade: 'µg/m³',
    limite: 15,
    referencia: 'Limite OMS: 15 µg/m³',
    rotuloBom: 'Dentro do limite',
    casas: 1,
  },
  {
    chave: 'co2' as const,
    nome: 'Dióxido de carbono (CO₂)',
    unidade: 'ppm',
    limite: 1000,
    referencia: 'Alerta: acima de 1000 ppm',
    rotuloBom: 'Ar renovado',
    casas: 0,
  },
  {
    chave: 'covs' as const,
    nome: 'Compostos orgânicos (COVs)',
    unidade: 'mg/m³',
    limite: 0.5,
    referencia: 'Máximo: 0,50 mg/m³',
    rotuloBom: 'Vestigial',
    casas: 2,
  },
];

/** Telas 10 a 12 — histórico analítico por período. */
export function TelaHistorico() {
  const { amplo } = useLarguraDaTela();
  const [periodo, setPeriodo] = useState<PeriodoHistorico>('7d');
  const [dados, setDados] = useState<Historico | null>(null);

  useEffect(() => {
    let vivo = true;
    void arService.historico(periodo).then((d) => {
      if (vivo) setDados(d);
    });
    return () => {
      vivo = false;
    };
  }, [periodo]);

  // Enquanto o período novo não chega, o que está em memória é do período
  // anterior. Comparar em vez de limpar o estado dentro do efeito evita uma
  // renderização em cascata — e mostrar o gráfico errado por um instante.
  const carregado = dados?.periodo === periodo ? dados : null;

  const seletor = (
    <View style={estilos.seletor}>
      {PERIODOS.map((p) => {
        const ativo = p.chave === periodo;
        return (
          <Pressable
            key={p.chave}
            onPress={() => setPeriodo(p.chave)}
            accessibilityRole="tab"
            accessibilityState={{ selected: ativo }}
            accessibilityLabel={`Período de ${p.rotulo}`}
            style={[estilos.aba, ativo && estilos.abaAtiva]}
          >
            <Texto style={[estilos.abaTexto, ativo && estilos.abaTextoAtivo]}>{p.rotulo}</Texto>
          </Pressable>
        );
      })}
    </View>
  );

  if (!carregado) {
    return (
      <Tela>
        <Cabecalho titulo="Histórico analítico" apoio="Visão consolidada do ambiente" />
        {seletor}
        <Carregando texto="Carregando o período…" />
      </Tela>
    );
  }

  const faixa = classificarIQA(carregado.resumo.media);

  const painelDoGrafico = (
    <Cartao>
      <View style={estilos.topo}>
        <View>
          <Rotulo>Índice médio do período</Rotulo>
          <View style={estilos.linhaMedia}>
            <Texto style={estilos.media}>{carregado.resumo.media}</Texto>
            <Texto style={[estilos.classificacao, { color: faixa.texto }]}>{faixa.rotulo}</Texto>
          </View>
        </View>
      </View>

      <GraficoHistorico pontos={carregado.pontos} />
    </Cartao>
  );

  const extremos = (
    <View style={estilos.duplo}>
      <Cartao estilo={estilos.extremo}>
        <Rotulo>Pior do período</Rotulo>
        <View style={estilos.linhaExtremo}>
          <Texto style={estilos.valorExtremo}>{carregado.resumo.pior.iqa}</Texto>
          <Texto style={estilos.rotuloExtremo}>{carregado.resumo.pior.rotulo}</Texto>
        </View>
      </Cartao>
      <Cartao estilo={estilos.extremo}>
        <Rotulo>Melhor do período</Rotulo>
        <View style={estilos.linhaExtremo}>
          <Texto style={estilos.valorExtremo}>{carregado.resumo.melhor.iqa}</Texto>
          <Texto style={estilos.rotuloExtremo}>{carregado.resumo.melhor.rotulo}</Texto>
        </View>
      </Cartao>
    </View>
  );

  const painelDasMetricas = (
    <Cartao estilo={estilos.metricas}>
      <Rotulo>Métricas chave (médias)</Rotulo>
      {METRICAS.map((m) => {
        const valor =
          carregado.pontos.reduce((s, p) => s + p[m.chave], 0) / carregado.pontos.length;
        return (
          <MetricaChave
            key={m.chave}
            nome={m.nome}
            valor={m.casas === 0 ? String(Math.round(valor)) : numero(valor, m.casas)}
            unidade={m.unidade}
            ocupacao={valor / m.limite}
            referencia={m.referencia}
            rotuloBom={m.rotuloBom}
          />
        );
      })}
    </Cartao>
  );

  return (
    <Tela>
      <Cabecalho titulo="Histórico analítico" apoio="Visão consolidada do ambiente" />
      {seletor}

      {amplo ? (
        <View style={estilos.colunas}>
          <View style={estilos.colunaPrincipal}>
            {painelDoGrafico}
            {extremos}
          </View>
          <View style={estilos.colunaLateral}>{painelDasMetricas}</View>
        </View>
      ) : (
        <>
          {painelDoGrafico}
          {extremos}
          {painelDasMetricas}
        </>
      )}
    </Tela>
  );
}

const estilos = StyleSheet.create({
  seletor: {
    flexDirection: 'row',
    gap: spacing.mini,
    backgroundColor: colors.cartao,
    borderWidth: 1,
    borderColor: colors.bordaCartao,
    borderRadius: radius.pilula,
    padding: spacing.mini,
    alignSelf: 'flex-start',
  },
  aba: {
    paddingVertical: spacing.pequeno + 1,
    paddingHorizontal: spacing.grande,
    borderRadius: radius.pilula,
  },
  abaAtiva: { backgroundColor: colors.primaria },
  abaTexto: {
    fontSize: typography.tamanho.apoio,
    fontWeight: typography.peso.forte,
    color: colors.textoApoio,
  },
  abaTextoAtivo: { color: colors.cartao },

  colunas: { flexDirection: 'row', gap: spacing.grande, alignItems: 'flex-start' },
  colunaPrincipal: { flex: 1, gap: spacing.padrao },
  colunaLateral: { width: 340 },

  topo: { marginBottom: spacing.medio },
  linhaMedia: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.medio,
    marginTop: spacing.mini,
  },
  media: {
    fontSize: typography.tamanho.numero,
    fontWeight: typography.peso.extra,
    color: colors.texto,
    letterSpacing: -1.5,
  },
  classificacao: { fontSize: typography.tamanho.titulo, fontWeight: typography.peso.extra },

  duplo: { flexDirection: 'row', gap: spacing.medio },
  extremo: { flex: 1, padding: spacing.medio + 2 },
  linhaExtremo: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.pequeno,
    marginTop: spacing.mini,
  },
  valorExtremo: {
    fontSize: typography.tamanho.numeroMedio,
    fontWeight: typography.peso.extra,
    color: colors.texto,
    letterSpacing: -0.8,
  },
  rotuloExtremo: {
    fontSize: typography.tamanho.apoio,
    fontWeight: typography.peso.semi,
    color: colors.textoFraco,
  },

  metricas: { gap: spacing.grande },
});
