# Design System (base)

Este arquivo define onde e como os tokens visuais do app devem ser centralizados, para que as
telas desenvolvidas por cada pessoa (e por cada Claude) fiquem visualmente consistentes. Os
valores concretos (paleta de cores, escala tipográfica) ainda serão definidos junto ao protótipo
de telas (Figma ou equivalente) — este documento fixa apenas a **estrutura** a seguir.

## Onde ficam os tokens

`src/theme/` — um único ponto de verdade, já criado a partir do protótipo aprovado no Figma:

```
src/theme/
  colors.ts       Paleta de cores e as faixas do IQA
  typography.ts   Família, escala de tamanhos, pesos e alturas de linha
  spacing.ts      Espaçamento (múltiplos de 4), raios, alvo mínimo de toque, largura de quebra
  index.ts        Reexporta tudo como um único objeto `theme`
```

A família tipográfica é a **Plus Jakarta Sans**, carregada em `src/app/_layout.tsx` com `expo-font`
(pacote `@expo-google-fonts/plus-jakarta-sans`, pesos 400 a 800). Cada peso é uma família
separada, porque nas plataformas nativas o `fontWeight` não escolhe o peso de uma fonte customizada.
Por isso **todo texto usa `Texto` (e todo campo `EntradaTexto`) de `src/components/`**, nunca `Text`
ou `TextInput` do React Native: os estilos continuam dizendo só `fontWeight: typography.peso.*`, e
o componente traduz o peso para a família certa. A tela de abertura fica visível até as fontes
carregarem; se o carregamento falhar, o app abre com a fonte do sistema.

## Regras

1. **Nenhuma cor ou tamanho de fonte "mágico" solto no código.** Toda tela/componente consome
   valores de `src/theme/`, nunca hexadecimais ou `fontSize` soltos inline.
2. A paleta de cores do indicador de qualidade do ar (IQA) deve seguir a escala de cores já
   padronizada pelo mercado (verde/amarelo/laranja/vermelho/roxo/marrom — mesma lógica usada por
   IQAir, Awair, AirGradient, citados na pesquisa de mercado), para não reinventar uma convenção
   que o usuário final já reconhece.

   > `faixasIQA`, em `src/theme/colors.ts`, implementa os seis níveis (Excelente / Moderado /
   > Atenção / Ruim / Muito ruim / Perigoso, limites 50 / 100 / 150 / 200 / 300). O protótipo
   > do Figma tinha três faixas; a migração foi decidida em equipe e mexeu só naquele array:
   > as telas classificam pelo `classificarIQA()` de `src/utils/iqa.ts` e nunca comparam o
   > número com um limite por conta própria.

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
