# clean-air-tech

Frontend (React Native + Expo, mobile + web) do TCC **"Dispositivo de Monitoramento de
Qualidade do Ar com Aplicativo de Aconselhamento"** — Engenharia de Software, UNICESUMAR
Curitiba.

Equipe: Daniel Fernando Abreu de Moraes, Gabriel Guedes Archanjo, Lorena Andrade de Souza,
Vanusa da Silva Almeida.

> **Estado atual:** além da arquitetura e dos padrões (estrutura de pastas, lint, testes, CI/CD,
> convenção de commits e fluxo de branches), o repositório já traz o **protótipo das 12 telas**
> do aplicativo, portado do protótipo aprovado no Figma. Os dados ainda não vêm do back-end: a
> camada `src/services/` responde com uma simulação determinística dos sensores e uma conta em
> memória, trocável pela API real sem tocar nas telas. Ver `docs/ARQUITETURA.md`.

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

## Telas

| Rota               | Tela                                             |
| ------------------ | ------------------------------------------------ |
| `/`                | Login                                            |
| `/esqueci-senha`   | Recuperar acesso — etapa 1 (e-mail)              |
| `/verificar-email` | Recuperar acesso — etapa 2 (código de 6 dígitos) |
| `/nova-senha`      | Recuperar acesso — etapa 3 (nova senha)          |
| `/cadastro`        | Criar conta em 4 etapas                          |
| `/painel`          | Painel do IQA em tempo real (aba Início)         |
| `/historico`       | Histórico analítico de 7, 30 e 90 dias (aba)     |
| `/assistente`      | Assistente de aconselhamento (aba)               |
| `/configuracoes`   | Configurações (aba)                              |
| `/perfil`          | Dados pessoais                                   |
| `/alterar-senha`   | Troca de senha de quem já entrou                 |
| `/privacidade`     | Privacidade, segurança e exclusão de conta       |

As telas são as mesmas em celular e web. O layout muda por largura (`useLarguraDaTela`): abaixo
de 900 px, uma coluna de polegar; acima, duas colunas. Não existe uma versão por plataforma.

Conta de demonstração: `ana.silva@email.com` / `Purifica@2025`. Na recuperação de senha o código
não sai por e-mail — ele aparece na própria tela, para a apresentação não depender de caixa de
entrada.

## Protótipo publicado

A cada push em `develop`, o workflow `.github/workflows/pages.yml` publica a versão web no
GitHub Pages: <https://danieldonanfer.github.io/clean-air-tech/>. O site mostra uma faixa
avisando que os dados são simulados. O `baseUrl` `/clean-air-tech` está em `app.json`
(`experiments.baseUrl`); localmente `npm run web` continua abrindo na raiz.

Requer **Settings → Pages → Source: GitHub Actions** no repositório.

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
