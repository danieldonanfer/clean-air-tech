# Como contribuir

Guia rápido para quem (pessoa ou assistente) vai desenvolver neste repositório. Para o contexto
completo, ver `CLAUDE.md` (se você é uma instância do Claude Code) e os documentos em `docs/`.

## Setup local

```bash
npm install
npm run start        # abre o Expo Dev Tools (escolha iOS, Android ou Web)
```

## Antes de abrir um PR

```bash
npm run lint
npm run typecheck
npm test
```

Os três precisam passar. O hook de pre-commit (Husky + lint-staged) já roda lint/format
automaticamente nos arquivos alterados a cada commit; o hook de commit-msg valida o formato da
mensagem (Conventional Commits).

## Fluxo de branches

Resumo (detalhes em `docs/GIT_WORKFLOW.md`):

1. Parta sempre de `develop` atualizada.
2. Crie `feature/`, `fix/`, `chore/`, `docs/` ou `refactor/` + nome curto.
3. Commits no padrão `docs/CONVENCAO_COMMITS.md`.
4. Abra PR para `develop` usando o template automático.
5. Aguarde CI verde + revisão antes do merge (squash).

## Autoria dos commits

O autor de cada commit deve ser sempre a pessoa humana responsável. Nenhum commit deve citar o
Claude como autor/coautor — ver a regra completa em `CLAUDE.md`.
