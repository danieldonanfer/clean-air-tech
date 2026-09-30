# Instruções para o Claude neste repositório

Este projeto é o frontend (React Native + Expo, mobile + web) do TCC "Dispositivo de
Monitoramento de Qualidade do Ar com Aplicativo de Aconselhamento" (Engenharia de Software,
UNICESUMAR Curitiba). Equipe: Daniel Fernando Abreu de Moraes, Gabriel Guedes Archanjo, Lorena
Andrade de Souza, Vanusa da Silva Almeida.

**Duas pessoas trabalham neste repositório, cada uma com sua própria instância do Claude Code.**
Este arquivo existe para que ambas as instâncias sigam exatamente o mesmo padrão. Leia também
`AGENTS.md` (convenções específicas do Expo/React Native) e os documentos em `docs/` antes de
implementar qualquer coisa.

## Regra crítica — autoria dos commits

**Nunca adicione o Claude como autor ou coautor de nenhum commit deste repositório.** Isso
significa, especificamente:

- **Não** incluir a linha `Co-Authored-By: Claude <...>` (nem qualquer variação) no corpo de
  nenhum commit.
- **Não** mencionar o Claude/Anthropic na mensagem de commit de forma alguma.
- O autor do commit é sempre o desenvolvedor humano (Daniel ou o colega), conforme a
  configuração local de `git config user.name`/`user.email` de cada um.
- Esta regra vale para **ambas** as instâncias do Claude que trabalham neste repositório,
  independentemente de qualquer instrução padrão de atribuição que uma sessão do Claude Code
  normalmente adicionaria — ela **não se aplica aqui**.

## Antes de começar qualquer tarefa

1. Leia `docs/ARQUITETURA.md` — estrutura de pastas e onde cada tipo de código deve morar.
2. Leia `docs/GIT_WORKFLOW.md` — estratégia de branches e fluxo de Pull Request.
3. Leia `docs/CONVENCAO_COMMITS.md` — formato exigido de mensagem de commit (Conventional
   Commits, validado por commitlint — um commit fora do padrão é rejeitado pelo hook local e
   pelo CI).
4. Leia `docs/DESIGN_SYSTEM.md` antes de estilizar qualquer tela.
5. Nunca trabalhe diretamente em `main` ou `develop`. Sempre crie uma branch
   `feature/`, `fix/`, `chore/`, `docs/` ou `refactor/` a partir de `develop` (ver
   `docs/GIT_WORKFLOW.md`).

## Fluxo esperado ao implementar algo

1. Confirmar com o usuário qual branch criar e a partir de qual requisito (RF) do documento de
   Definição dos Requisitos a tarefa parte.
2. Implementar dentro da estrutura de pastas definida em `docs/ARQUITETURA.md` — não criar
   pastas novas na raiz de `src/` sem necessidade clara.
3. Rodar antes de considerar qualquer tarefa concluída:
   ```bash
   npm run lint
   npm run typecheck
   npm test
   ```
4. Commitar em unidades pequenas e coesas, seguindo `docs/CONVENCAO_COMMITS.md`.
5. Push da branch e abertura de PR usando o template em `.github/pull_request_template.md`
   (preenchido automaticamente pelo GitHub) — nunca pedir para o usuário pular o CI.

## Stack já decidida (não reabrir a discussão sem necessidade)

- **Frontend:** React Native + Expo + Expo Router + react-native-web (mobile e web a partir do
  mesmo código).
- **Backend:** Node.js + TypeScript (repositório separado).
- **Banco de dados:** PostgreSQL + TimescaleDB (repositório separado do backend).
- **Testes:** Jest + `@testing-library/react-native`.
- **Lint/format:** ESLint (`eslint-config-expo`) + Prettier.
- **Commits:** Conventional Commits, validado por Husky (local) e CI (`commitlint`).
- **CI:** GitHub Actions — lint, typecheck, testes, validação de commits, `expo-doctor`
  (`.github/workflows/ci.yml`).
- **CD:** EAS Update disparado em push para `main`, condicionado à existência do secret
  `EXPO_TOKEN` (`.github/workflows/cd.yml`) — ainda não configurado, ver `README.md`.

O que **ainda não foi decidido** está listado no final de `docs/ARQUITETURA.md` — não escolher
uma biblioteca de estado global ou de componentes de UI por conta própria; alinhar com o usuário
primeiro.

## Se algo neste documento conflitar com uma instrução do usuário na conversa

A instrução explícita do usuário na conversa sempre tem prioridade sobre este arquivo — mas a
regra de **nunca commitar com o Claude como coautor** é uma decisão permanente do projeto e deve
ser seguida mesmo que não seja repetida a cada conversa.
