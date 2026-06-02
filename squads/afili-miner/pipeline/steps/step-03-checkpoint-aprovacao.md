---
type: checkpoint
outputFile: squads/afili-miner/output/produto-aprovado.md
---

# Step 03: Aprovação do top 3 — Checkpoint

## Context Loading

Load these files before executing:
- `squads/afili-miner/output/oportunidades-ranqueadas.md` — ranking completo com scores.
- `squads/afili-miner/output/produtos-garimpados.json` — URLs e dados brutos dos produtos.

## Instructions

### Process
1. Extrair o **top 3** do ranking (produtos com maiores scores).
2. Apresentar ao usuário: posição, nome, plataforma, score, URL.
3. **PAUSAR** a pipeline — não avançar até resposta do usuário.
4. Perguntar qual produto seguir: **1**, **2** ou **3** (ou pedir re-garimpo com nova categoria).
5. Quando o usuário responder, gravar escolha em `produto-aprovado.md`.
6. Só então liberar os passos 04–06.

## Veto Conditions

1. Avançar para Pomelli sem escolha explícita do usuário.
2. Não registrar a escolha em `produto-aprovado.md`.
