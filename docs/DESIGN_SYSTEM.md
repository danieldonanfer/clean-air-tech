# Design System (base)

Este arquivo define onde e como os tokens visuais do app devem ser centralizados, para que as
telas desenvolvidas por cada pessoa (e por cada Claude) fiquem visualmente consistentes. Os
valores concretos (paleta de cores, escala tipográfica) ainda serão definidos junto ao protótipo
de telas (Figma ou equivalente) — este documento fixa apenas a **estrutura** a seguir.

## Onde ficam os tokens

`src/theme/` — um único ponto de verdade. Estrutura sugerida quando o tema for criado:

```
src/theme/
  colors.ts       Paleta de cores (ex.: primary, background, danger, aqi-good, aqi-moderate...)
  typography.ts   Famílias, tamanhos e pesos de fonte
  spacing.ts      Escala de espaçamento (ex.: múltiplos de 4px)
  index.ts        Reexporta tudo como um único objeto `theme`
```

## Regras

1. **Nenhuma cor ou tamanho de fonte "mágico" solto no código.** Toda tela/componente consome
   valores de `src/theme/`, nunca hexadecimais ou `fontSize` soltos inline.
2. A paleta de cores do indicador de qualidade do ar (IQA) deve seguir a escala de cores já
   padronizada pelo mercado (verde/amarelo/laranja/vermelho/roxo/marrom — mesma lógica usada por
   IQAir, Awair, AirGradient, citados na pesquisa de mercado), para não reinventar uma convenção
   que o usuário final já reconhece.
3. Componentes de `src/components/` devem ser "burros" (apenas recebem props e tema) — nenhuma
   chamada a `services/` dentro de um componente puramente visual.
4. Ao incorporar um protótipo de UI (Figma/imagem) em uma tela, extrair primeiro os tokens
   (cores, fontes, espaçamentos) para `src/theme/`, e só depois construir a tela consumindo-os —
   nunca copiar valores fixos direto do protótipo para dentro do componente.

## Acessibilidade (mínimo esperado)

- Contraste de texto/fundo compatível com WCAG AA.
- Todo elemento interativo (botão, ícone clicável) com `accessibilityLabel`.
- Não depender apenas de cor para comunicar estado (ex.: alerta de IQA ruim deve ter também
  ícone/texto, não só a cor vermelha) — importante dado o público diverso do app.
