---
execution: subagent
agent: garimpeiro
outputFile: squads/afili-miner/output/produtos-garimpados.json
model_tier: powerful
---

# Step 01: Garimpar os 5 melhores produtos do momento

## Context Loading

Load these files before executing:
- `_opensquad/_memory/company.md` — contexto LALAFILIADOS (Galdino).
- `squads/afili-miner/pipeline/data/research-brief.md` — fontes BR e formato de input.
- `squads/afili-miner/pipeline/data/domain-framework.md` — metodologia de garimpo.
- `squads/afili-miner/pipeline/data/anti-patterns.md` — erros a evitar.

## Instructions

### Process
1. Perguntar ou usar o input do usuário: **(a)** categoria livre (ex.: "suplementos") ou **(b)** link direto Amazon/Hotmart/Kiwify/ML.
2. Executar `web_search` nas fontes prioritárias: Amazon BR Best Sellers, Movers & Shakers, Hotmart Top, Kiwify trending, Mercado Livre mais vendidos, Google Trends ascendentes.
3. Confirmar páginas com `web_fetch` quando necessário.
4. Selecionar os **5 melhores** produtos do momento para aquele contexto.
5. Montar JSON com: nome, plataforma, URL, comissão estimada (com % e fonte), ranking de vendas (posição + lista + fonte).
6. Salvar em `produtos-garimpados.json`.

## Veto Conditions

1. Menos de 5 produtos no array sem explicar falha de fontes no JSON.
2. Qualquer produto sem URL válida ou sem os 5 campos obrigatórios.
3. JSON inválido ou não parseável.
