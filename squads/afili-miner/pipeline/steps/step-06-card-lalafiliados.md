---
execution: inline
agent: relator
inputFile: squads/afili-miner/output/briefing-campanha.md
outputFile: squads/afili-miner/output/card-oportunidade.md
---

# Step 06: Consolidar card LALAFILIADOS

## Context Loading

Load these files before executing:
- `squads/afili-miner/output/produtos-garimpados.json`
- `squads/afili-miner/output/oportunidades-ranqueadas.md`
- `squads/afili-miner/output/produto-aprovado.md`
- `squads/afili-miner/output/produto-dna.json`
- `squads/afili-miner/output/briefing-campanha.md`
- `squads/afili-miner/_memory/memories.md` — tag Amazon `galdino1307-20`

## Instructions

### Process
1. Consolidar nome e descrição do produto (2–3 frases).
2. Incluir **score de oportunidade** do produto aprovado.
3. Montar **link de afiliado**: Amazon BR → `tag=galdino1307-20`.
4. Resumir **DNA** e **briefing**.
5. Listar **mínimo 3 próximos passos** acionáveis.
6. Gerar `card-oportunidade.md` e `card-oportunidade.json` (`tipo: lalafiliados_card`).

## Veto Conditions

1. Produto Amazon sem tag `galdino1307-20` no link afiliado.
2. Apenas markdown ou apenas JSON — ambos obrigatórios.
3. Menos de 3 próximos passos.
