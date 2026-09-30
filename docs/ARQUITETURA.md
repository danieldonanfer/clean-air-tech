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
- Arquivo de exemplo mantido propositalmente em `src/utils/aqi.example.ts` +
  `src/utils/__tests__/aqi.example.test.ts`: demonstra o padrão esperado de nomeação e estrutura
  de teste. Remova-o assim que a primeira função real de `utils/` for adicionada.

## Design System

Ver [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) para os tokens de tema e convenções visuais.

## O que ainda não foi decidido (decidir em equipe antes de usar)

- Biblioteca de gerenciamento de estado global em `src/store/` (ex.: Zustand, Redux Toolkit,
  Context API pura) — ainda não escolhida. Não instalar nenhuma sem alinhar com o time.
- Biblioteca de componentes de UI (ex.: Tamagui, NativeWind/Tailwind, React Native Paper) — ainda
  não escolhida. Até lá, estilizar com `StyleSheet` nativo do React Native.
