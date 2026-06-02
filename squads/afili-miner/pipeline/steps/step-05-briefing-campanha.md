---
execution: inline
agent: estrategista-campanha
inputFile: squads/afili-miner/output/produto-dna.json
outputFile: squads/afili-miner/output/briefing-campanha.md
---

# Step 05: Montar briefing de campanha

## Context Loading

Load these files before executing:
- `squads/afili-miner/output/produto-dna.json` — DNA Pomelli completo.
- `squads/afili-miner/output/oportunidades-ranqueadas.md` — score do produto aprovado.
- `squads/afili-miner/pipeline/data/tone-of-voice.md` — tons disponíveis.
- `squads/afili-miner/output/produto-aprovado.md` — nome e plataforma.

## Instructions

### Process
1. Definir **hook principal** em exatamente **1 frase**.
2. Descrever **público-alvo preciso** (demografia, contexto, objeção).
3. Recomendar **canal principal**: Reels, TikTok, Google Ads ou WhatsApp.
4. Decidir **orgânico vs pago vs híbrido** com critério explícito.
5. Incluir plano de **teste 7 dias**.
6. Salvar briefing em markdown.

## Veto Conditions

1. Sem recomendação de canal.
2. Sem decisão orgânico/pago.
