# Domain Framework — Afiliação e Mineração de Produtos

## Metodologia em 6 Etapas

### 1. Garimpo (Gael Garimpeiro)

1. Interpretar input (categoria ou URL).
2. Consultar fontes prioritárias via `web_search` e `web_fetch`.
3. Filtrar duplicatas e produtos sem página pública.
4. Selecionar exatamente 5 produtos com melhor sinal de vendas/tendência.
5. Montar JSON com: nome, plataforma, URL, comissão estimada, ranking de vendas.

### 2. Análise (Ana Analista)

1. Ler lista do garimpeiro.
2. Para cada produto, estimar comissão, volume Trends, concorrência e tendência 30d.
3. Calcular score ponderado (0–100).
4. Ordenar descendente.
5. Justificar em 2 linhas por produto.

### 3. Checkpoint

1. Apresentar top 3 com scores.
2. Pausar até o usuário escolher 1 produto (ou pedir re-garimpo).

### 4. DNA Pomelli (Pedro Pomelli)

1. `web_fetch` na URL de vendas aprovada.
2. Extrair Brand Voice, USP, Market Gap, Top 3 dores.
3. Validar JSON estruturado.

### 5. Campanha (Ester Estrategista)

1. Ler DNA.
2. Definir hook, público, canal (Reels/TikTok/Google Ads/WhatsApp), orgânico vs pago.
3. Entregar briefing em markdown.

### 6. Relatório (Rafael Relator)

1. Consolidar todos os artefatos.
2. Gerar markdown + JSON para import no LALAFILIADOS.
3. Aplicar tag Amazon `galdino1307-20` quando plataforma = Amazon.

## Construção de Link Afiliado Amazon

Padrão: acrescentar `?tag=galdino1307-20` (ou `&tag=` se já houver query string).
