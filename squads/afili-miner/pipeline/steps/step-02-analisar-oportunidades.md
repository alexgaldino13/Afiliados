---
execution: subagent
agent: analista-oportunidade
inputFile: squads/afili-miner/output/produtos-garimpados.json
outputFile: squads/afili-miner/output/oportunidades-ranqueadas.md
model_tier: powerful
---

# Step 02: Pontuar e ranquear oportunidades

## Context Loading

Load these files before executing:
- `squads/afili-miner/output/produtos-garimpados.json` — lista do Garimpeiro.
- `squads/afili-miner/pipeline/data/quality-criteria.md` — pesos e rubrica.
- `squads/afili-miner/pipeline/data/domain-framework.md` — fórmula de score.

## Instructions

### Process
1. Ler os 5 produtos do JSON de entrada.
2. Para cada produto, pesquisar sinais complementares com `web_search` (Google Trends, anúncios estimados).
3. Atribuir sub-scores 0–100: comissão % (peso **30**), volume Trends (peso **25**), concorrência em anúncios (peso **25**), tendência 30 dias (peso **20**).
4. Calcular score final ponderado e ordenar do maior para o menor.
5. Escrever **exatamente 2 linhas** de justificativa por produto.
6. Salvar markdown com tabela resumo + detalhamento.

## Veto Conditions

1. Menos de 5 produtos pontuados.
2. Justificativa com mais de 2 linhas por produto.
3. Pesos diferentes dos definidos (30/25/25/20).
