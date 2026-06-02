---
execution: subagent
agent: pomelli-engine
inputFile: squads/afili-miner/output/produto-aprovado.md
outputFile: squads/afili-miner/output/produto-dna.json
model_tier: powerful
---

# Step 04: Extrair DNA completo (Pomelli Engine)

## Context Loading

Load these files before executing:
- `squads/afili-miner/output/produto-aprovado.md` — produto escolhido no checkpoint.
- `squads/afili-miner/pipeline/data/domain-framework.md` — definição dos 4 campos DNA.
- `squads/afili-miner/pipeline/data/anti-patterns.md` — não inventar sem fetch.

## Instructions

### Process
1. Ler URL de vendas do produto aprovado.
2. Executar `web_fetch` na página de vendas.
3. Extrair e redigir: **Brand Voice**, **USP**, **Market Gap**, **Top 3 dores do avatar**.
4. Salvar JSON estruturado em `produto-dna.json`.
5. Incluir `confianca` (baixa|media|alta) e `url_analisada`.

## Veto Conditions

1. JSON sem um dos 4 campos ou com `dores_avatar` ≠ 3 itens.
2. DNA gerado sem tentativa de `web_fetch` na URL aprovada.
