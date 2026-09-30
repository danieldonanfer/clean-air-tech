import { Tabs } from 'expo-router';
import { Protegida, Icone, type NomeDeIcone } from '../../components';
import { colors, familiaDoPeso, typography } from '../../theme';

/**
 * Navegador das telas de dentro. As quatro abas são as mesmas do protótipo; em
 * tela larga o Expo Router mantém a mesma barra, e o que muda é o layout de cada
 * tela (ver useLarguraDaTela).
 */
const ABAS: { nome: string; titulo: string; icone: NomeDeIcone }[] = [
  { nome: 'painel', titulo: 'Início', icone: 'casa' },
  { nome: 'historico', titulo: 'Histórico', icone: 'grafico' },
  { nome: 'assistente', titulo: 'Assistente', icone: 'conversa' },
  { nome: 'configuracoes', titulo: 'Ajustes', icone: 'engrenagem' },
];

export default function LayoutDoApp() {
  return (
    <Protegida>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primaria,
          tabBarInactiveTintColor: colors.textoFraco,
          tabBarStyle: {
            backgroundColor: colors.cartao,
            borderTopColor: colors.bordaCartao,
          },
          tabBarLabelStyle: {
            fontSize: typography.tamanho.micro,
            fontFamily: familiaDoPeso(typography.peso.semi),
          },
        }}
      >
        {ABAS.map((aba) => (
          <Tabs.Screen
            key={aba.nome}
            name={aba.nome}
            options={{
              title: aba.titulo,
              tabBarIcon: ({ color, focused }) => (
                <Icone nome={aba.icone} tamanho={22} cor={color} traco={focused ? 2.3 : 2} />
              ),
            }}
          />
        ))}
      </Tabs>
    </Protegida>
  );
}
