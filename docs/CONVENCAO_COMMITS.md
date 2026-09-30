# Convenção de Commits (Conventional Commits)

Este projeto segue [Conventional Commits](https://www.conventionalcommits.org/pt-br/v1.0.0/),
validado automaticamente por `commitlint` — tanto localmente (hook `commit-msg` do Husky) quanto
no CI (job `commitlint` em `.github/workflows/ci.yml`). Um commit fora do padrão é rejeitado.

## Formato

```
<tipo>(<escopo opcional>): <descrição curta no imperativo>

<corpo opcional — explica o "porquê", não o "o quê">

<rodapé opcional — ex.: "Closes #12">
```

## Tipos aceitos

| Tipo       | Quando usar                                                       |
| ---------- | ----------------------------------------------------------------- |
| `feat`     | Nova funcionalidade ou tela visível para o usuário                |
| `fix`      | Correção de bug                                                   |
| `docs`     | Apenas mudanças de documentação                                   |
| `style`    | Formatação, espaçamento, ponto e vírgula — sem mudança de lógica  |
| `refactor` | Mudança de código que não corrige bug nem adiciona funcionalidade |
| `perf`     | Mudança que melhora performance                                   |
| `test`     | Adição ou correção de testes                                      |
| `build`    | Mudanças no build, dependências, configuração do Expo/EAS         |
| `ci`       | Mudanças nos workflows de CI/CD                                   |
| `chore`    | Tarefas de manutenção que não se encaixam nas categorias acima    |
| `revert`   | Reverte um commit anterior                                        |

## Exemplos

```
feat(dashboard): exibir IQA em tempo real na tela inicial

fix(ble): corrigir timeout no pareamento quando o dispositivo está fora de alcance

docs: adicionar guia de fluxo de branches

test(utils): cobrir casos extremos de clampAqi

chore(deps): atualizar expo para SDK 57
```

## Regras práticas

- Descrição curta (linha 1) em minúsculas, no imperativo, sem ponto final.
- Cada commit deve representar uma mudança coesa e revisável — evite commits gigantes
  misturando `feat` com `fix` com `chore`.
- **Nunca** incluir `Co-Authored-By: Claude` ou qualquer menção ao assistente como autor
  (ver regra em [GIT_WORKFLOW.md](GIT_WORKFLOW.md) e em `CLAUDE.md`).
- Escopo (`(dashboard)`, `(ble)`, `(auth)` etc.) é opcional, mas recomendado quando o commit
  afeta uma feature específica — ajuda a navegar o histórico.
