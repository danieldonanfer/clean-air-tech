# clean-air-tech

Frontend (React Native + Expo, mobile + web) do TCC **"Dispositivo de Monitoramento de
Qualidade do Ar com Aplicativo de Aconselhamento"** — Engenharia de Software, UNICESUMAR
Curitiba.

Equipe: Daniel Fernando Abreu de Moraes, Gabriel Guedes Archanjo, Lorena Andrade de Souza,
Vanusa da Silva Almeida.

> Este repositório contém, por enquanto, apenas a **arquitetura e os padrões** do projeto
> (estrutura de pastas, lint, testes, CI/CD, convenção de commits e fluxo de branches) — o
> desenvolvimento das telas ainda não foi iniciado. Ver `docs/ARQUITETURA.md`.

## Stack

- React Native + Expo + Expo Router
- `react-native-web` (mesmo código para iOS, Android e Web)
- TypeScript (strict)
- Jest + `@testing-library/react-native`
- ESLint + Prettier
- Conventional Commits (Husky + commitlint)
- CI/CD via GitHub Actions

## Começando

```bash
npm install
npm run start
```

## Documentação

| Arquivo                                                  | Conteúdo                                                                    |
| -------------------------------------------------------- | --------------------------------------------------------------------------- |
| [`CLAUDE.md`](CLAUDE.md)                                 | Instruções para qualquer instância do Claude Code que trabalhar neste repo. |
| [`CONTRIBUTING.md`](CONTRIBUTING.md)                     | Guia rápido de setup e fluxo de contribuição.                               |
| [`docs/ARQUITETURA.md`](docs/ARQUITETURA.md)             | Estrutura de pastas e decisões de arquitetura de frontend.                  |
| [`docs/GIT_WORKFLOW.md`](docs/GIT_WORKFLOW.md)           | Estratégia de branches e Pull Requests.                                     |
| [`docs/CONVENCAO_COMMITS.md`](docs/CONVENCAO_COMMITS.md) | Formato de commit exigido (Conventional Commits).                           |
| [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md)         | Onde centralizar tokens visuais (cores, tipografia, espaçamento).           |

## Scripts

```bash
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
npm test            # Jest
npm run test:ci      # Jest com cobertura (mesmo comando usado no CI)
```

## CI/CD

- **CI** (`.github/workflows/ci.yml`): roda em todo PR/push para `main`/`develop` — lint,
  typecheck, testes, validação de mensagens de commit e `expo-doctor`.
- **CD** (`.github/workflows/cd.yml`): publica uma atualização OTA (EAS Update) a cada push em
  `main` bem-sucedido no CI. **Pendente de configuração:** criar o secret `EXPO_TOKEN` em
  _Settings > Secrets and variables > Actions_ com um token da conta Expo/EAS do time; até lá o
  job é pulado automaticamente.

## Branches

- `main` — estável/entregável, protegida.
- `develop` — integração, protegida.
- `feature/*`, `fix/*`, `chore/*`, `docs/*`, `refactor/*` — trabalho em andamento, uma por
  tarefa/requisito.

Detalhes completos em [`docs/GIT_WORKFLOW.md`](docs/GIT_WORKFLOW.md).
