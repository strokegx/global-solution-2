# AlertaBairro

Protótipo web da **Global Solution 2026/2 · CitizenTech** (FIAP, Engenharia de Software ON, 1º ano).

**Problema:** milhões de brasileiros vivem em áreas de risco de enchentes e deslizamentos (8.270.127 pessoas em 872 municípios, em 2010, segundo IBGE e Cemaden) e muitas vezes não recebem um aviso claro a tempo.

**Solução:** o AlertaBairro cruza a chuva prevista com as características de cada bairro (vulnerabilidade, altitude, proximidade de rio) e gera um nível de alerta (Baixo, Atenção, Alto, Crítico) com orientações e ponto de apoio. O aviso pode chegar por SMS, para funcionar sem internet.

**ODS:** 3, 9, 10, 11 e 13.

> Os 12 bairros usados na simulação são **fictícios**. O cálculo de risco é didático e não substitui os alertas oficiais da Defesa Civil.

## Como abrir e executar

1. Extraia o `.zip`.
2. Dê dois cliques em `index.html` (abre direto no navegador, sem instalar nada).

## Páginas

| Página | Conteúdo |
| --- | --- |
| `index.html` | Cidadão, problema (com dado real e fonte), proposta e ODS |
| `solucao.html` | Como funciona, **simulação interativa**, **formulário com validação** e tecnologias |
| `impacto.html` | Cenários de chuva calculados com o array, indicadores, ecossistema e ODS |
| `equipe.html` | Integrantes e vídeo pitch |

## Estrutura de pastas

```
index.html  solucao.html  impacto.html  equipe.html  README.md
css/style.css
js/dados.js        array de 12 bairros e regras de risco
js/main.js         menu, tamanho da fonte e alto contraste
js/simulacao.js    simulação interativa (DOM)
js/formulario.js   validação do formulário
js/impacto.js      cenários da página de impacto
img/               logo.svg, hero.svg, avatar.svg
```

## Tecnologias

HTML5 semântico, CSS3 (Flexbox, Grid, media queries) e JavaScript puro. Nenhum framework ou biblioteca externa.
O `localStorage` é usado só para lembrar o tamanho da letra e o alto contraste.

## Acessibilidade

Tags semânticas, `alt` nas imagens, `label` em todos os campos, navegação completa por teclado com foco visível, link "Pular para o conteúdo" e, além do básico:

- **Contraste alto desde o início:** texto escuro sobre branco (cerca de 19:1), marinho com âmbar nas faixas de destaque e todos os pares de cor de texto acima de 7:1 (nível AAA da WCAG).
- **Modo de alto contraste:** o botão leva o site a preto, branco e amarelo.
- **Letra maior:** texto de leitura com cerca de 20 px por padrão (antes 16 px) e botões A− / A+ com 5 níveis, do mínimo de 18 px até 27 px.
- **Nunca só cor:** cada nível de risco aparece com cor, texto ("Nível Crítico") e barra proporcional; botões ativos ganham um "✓".

## Integrantes

Grupo: **[NOME DO GRUPO]**

| Nome | RM |
| --- | --- |
| [Nome do integrante 1] | [RM] |
| [Nome do integrante 2] | [RM] |
| [Nome do integrante 3] | [RM] |
| [Nome do integrante 4] | [RM] |
| [Nome do integrante 5] | [RM] |

## Vídeo pitch

[COLE AQUI O LINK PÚBLICO DO VÍDEO]

## Publicação (opcional)

Para publicar no GitHub Pages: crie um repositório, envie os arquivos, e em *Settings → Pages* escolha a branch `main` e a pasta `/ (root)`. Coloque o link aqui: [LINK DO SITE NO AR]

## Uso de IA generativa

- **Claude (Anthropic):** apoio na estruturação inicial do código do protótipo (HTML, CSS e JavaScript) a partir do enunciado da Global Solution.
- O grupo revisou, testou e adaptou o código e entende como cada parte funciona. [Ajuste este texto ao que o seu grupo realmente fez.]

## Fontes

- IBGE e Cemaden. *População em áreas de risco no Brasil* (2018, Censo 2010): https://agenciadenoticias.ibge.gov.br/agencia-sala-de-imprensa/21565-em-2010-brasil-tinha-8-3-milhoes-de-pessoas-morando-em-areas-com-risco-de-desastres-naturais.html
