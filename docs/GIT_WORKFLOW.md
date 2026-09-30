# Fluxo de Git e Branches

Este projeto é desenvolvido por duas pessoas (Daniel e um colega), cada uma usando sua
própria instância do Claude Code. Este documento define o fluxo que **ambos** devem seguir,
para que o histórico e as branches fiquem consistentes independentemente de quem (ou qual
assistente) fez o commit.

## Branches permanentes

| Branch    | Propósito                                                      | Protegida?                                    |
| --------- | -------------------------------------------------------------- | --------------------------------------------- |
| `main`    | Código estável, correspondente ao que "funciona" / é entregue. | Sim — merge apenas via PR aprovado, CI verde. |
| `develop` | Integração contínua do trabalho em andamento.                  | Sim — merge apenas via PR, CI verde.          |

Nunca commitar diretamente em `main` ou `develop`. Todo trabalho acontece em branches
temporárias, que nascem de `develop` e voltam para `develop` via Pull Request.

## Branches temporárias

Nomeie sempre a partir de `develop`, com o prefixo que indica o tipo de trabalho:

- `feature/<nome-curto>` — nova funcionalidade ou tela (ex.: `feature/tela-dashboard-iqa`)
- `fix/<nome-curto>` — correção de bug (ex.: `fix/crash-pareamento-ble`)
- `chore/<nome-curto>` — tarefas de manutenção, config, dependências (ex.: `chore/atualizar-expo-sdk`)
- `docs/<nome-curto>` — apenas documentação
- `refactor/<nome-curto>` — refatoração sem mudar comportamento

Exemplo completo do fluxo:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/tela-dashboard-iqa

# ... commits ...

git push -u origin feature/tela-dashboard-iqa
# abrir Pull Request no GitHub: feature/tela-dashboard-iqa -> develop
```

## Divisão de trabalho entre os dois desenvolvedores

Para minimizar conflitos de merge quando trabalhando em paralelo:

1. Cada tela/funcionalidade nova vive em sua própria pasta dentro de `src/features/<nome>/`
   (ver [ARQUITETURA.md](ARQUITETURA.md)). Evite que os dois editem a mesma feature ao mesmo tempo.
2. Antes de começar algo novo, confira as branches abertas (`git branch -r` ou a lista de PRs no
   GitHub) para não duplicar trabalho.
3. Sempre que possível, cada branch de feature deve corresponder a **um único requisito funcional**
   (RF) do documento de Definição dos Requisitos — isso facilita rastreabilidade e review.
4. Puxe `develop` com frequência (`git pull origin develop` dentro da sua branch, ou rebase) para
   reduzir divergência antes de abrir o PR.

## Pull Requests

- Todo PR usa o template em `.github/pull_request_template.md` (preenchido automaticamente).
- Todo PR precisa de CI verde (lint, typecheck, testes, commitlint) antes do merge.
- Use **Squash and Merge** ao integrar em `develop`, para manter o histórico de `develop` limpo
  (um commit por feature/fix). Mensagem do squash deve seguir o Conventional Commits normalmente.
- Releases (`develop` → `main`) são feitas via PR próprio, sem squash (para preservar o histórico
  granular em `main`), tipicamente quando um conjunto de funcionalidades está pronto para entrega.

## Padrão de commits

Ver [CONVENCAO_COMMITS.md](CONVENCAO_COMMITS.md).

## Autoria dos commits — regra importante para os assistentes Claude

**Nenhum commit deste repositório deve incluir o Claude como autor ou coautor.** Isso vale tanto
para o Claude usado por Daniel quanto para o Claude usado pelo colega. Especificamente:

- Nunca adicionar a linha `Co-Authored-By: Claude <...>` (nem qualquer variação) no corpo do commit.
- O autor do commit deve ser sempre a pessoa humana responsável (configurado via `git config
user.name` / `user.email` local de cada desenvolvedor).
- Esta regra está reforçada em `CLAUDE.md` na raiz do repositório, que é lido automaticamente
  por qualquer instância do Claude Code operando neste projeto.
