# Arquitetura de Frontend

Stack: **React Native + Expo + Expo Router**, com suporte a **web** via `react-native-web`
(decisão já validada na pesquisa bibliográfica do TCC — ver documento "Pesquisa Bibliográfica e
de Mercado - Software"). Um único código-fonte roda em iOS, Android e Web.

## Estrutura de pastas

```
src/
  app/          Rotas (Expo Router). Cada arquivo = uma tela; _layout.tsx define navegadores.
                Não colocar componentes/lógica de negócio aqui — só composição de tela + navegação.
  components/   Componentes de UI reutilizáveis e "burros" (sem regra de negócio, sem chamada de API).
  features/     Uma subpasta por funcionalidade de negócio (ex.: features/dashboard-iqa/,
                features/pareamento-dispositivo/, features/recomendacoes-ia/). Cada feature agrupa
                seus próprios componentes, hooks e lógica específica que não se repete em outro lugar.
  services/     Camada de acesso a dados: clientes HTTP/MQTT, integração com o backend, BLE, storage.
                Nenhuma tela deve chamar fetch/BLE diretamente — sempre via um service.
  hooks/        Hooks reutilizáveis entre features (ex.: useDebounce, useNetworkStatus).
  store/        Estado global da aplicação (ex.: sessão do usuário, dispositivos pareados).
  theme/        Design tokens: cores, tipografia, espaçamento (ver docs/DESIGN_SYSTEM.md).
  types/        Tipos/interfaces TypeScript compartilhados entre features.
  utils/        Funções puras e utilitárias, sem dependência de React ou de APIs nativas.
```

Regra geral: **código específico de uma única tela/feature vive em `features/`; código
reaproveitado por 2+ features sobe para `components/`, `hooks/`, `services/` ou `utils/`.**

## Por que Expo Router

- Roteamento baseado em arquivos (equivalente ao padrão Next.js), já recomendado pela própria
  Expo para projetos novos.
- Funciona de forma idêntica em mobile e web — mesma stack de navegação para os 3 alvos.
- `_layout.tsx` em cada nível define navegadores aninhados (ex.: stack de autenticação vs. stack
  principal do app) sem precisar de configuração manual do React Navigation.

## Camada de serviços (`src/services/`)

Toda comunicação com o backend (REST/MQTT, conforme definido em "Definição das Tecnologias de
Software") deve passar por essa camada, nunca diretamente de dentro de um componente de tela.
Isso permite:

- Trocar a implementação (ex.: mock para testes) sem tocar na UI.
- Centralizar tratamento de erro, retry e cache offline (requisito RF de cache local ≥24h).
- Testar a lógica de integração isoladamente da árvore de componentes.

## Testes

- Testes unitários (`utils/`, `services/`, `hooks/`) com Jest.
- Testes de componente (`components/`, `features/`) com `@testing-library/react-native`.
- Todo PR que adiciona lógica nova (não puramente visual) deve vir acompanhado de teste — ver
  checklist do PR template.
- O arquivo de exemplo (`src/utils/aqi.example.ts`) foi removido quando as primeiras funções
  reais de `utils/` entraram, como este documento pedia. O padrão de nomeação e estrutura de
  teste agora está em `src/utils/__tests__/iqa.test.ts`, `senha.test.ts` e
  `src/services/__tests__/simulador.test.ts`.

## Dados enquanto o back-end não existe

`src/services/` já está no lugar, mas com implementação **mock**:

- `simulador.ts` — gera as leituras dos sensores com um modelo de três camadas (valor de base,
  ciclo diário de ocupação e ruído suave com semente). É determinístico de propósito: pedir o
  histórico duas vezes devolve o mesmo histórico, senão o gráfico mudaria a cada recarregamento.
- `contaLocal.ts` — usuário, senha e códigos de recuperação em memória. A senha fica em texto
  porque guardar hash no cliente não protege nada; o hash é responsabilidade do servidor.
- `arService`, `authService`, `perfilService`, `assistenteService`, `dispositivoService` — a
  interface que as telas consomem. Quando a API real entrar, só o corpo destes arquivos muda.

Nenhuma tela importa `simulador.ts` nem `contaLocal.ts` direto.

## Dependências adicionadas além do enxoval inicial

- `react-native-svg` — usada em `src/components/Icone.tsx` (o conjunto de ícones do protótipo),
  em `AnelIQA` e no gráfico do histórico. É o módulo recomendado pela própria Expo para desenho
  vetorial, e manter os ícones desenhados no projeto é o que deixa a tela idêntica ao Figma
  aprovado, em vez de aproximar com uma fonte de ícones pronta.

- `expo-font` e `@expo-google-fonts/plus-jakarta-sans` — a fonte do protótipo aprovado no Figma,
  carregada no layout raiz (ver [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)). O pacote evita versionar
  arquivos `.ttf` no repositório e entrega os pesos já com os nomes de família usados pelo tema.

Continua valendo a regra de não escolher biblioteca de estado global nem de componentes de UI sem
alinhar com o time: o estado de sessão usa Context API pura (`src/store/sessao.tsx`) e a
estilização é `StyleSheet` nativo.

## Design System

Ver [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) para os tokens de tema e convenções visuais.

## O que ainda não foi decidido (decidir em equipe antes de usar)

- Biblioteca de gerenciamento de estado global em `src/store/` — ainda não escolhida. Por ora
  `src/store/sessao.tsx` usa Context API pura, justamente para não decidir isso sozinho. Não
  instalar nenhuma sem alinhar com o time.
- Persistência da sessão entre execuções (`expo-secure-store` ou AsyncStorage) — hoje a sessão
  vive só em memória, então recarregar a página web derruba o login.
- Biblioteca de componentes de UI (ex.: Tamagui, NativeWind/Tailwind, React Native Paper) — ainda
  não escolhida. Até lá, estilizar com `StyleSheet` nativo do React Native.
