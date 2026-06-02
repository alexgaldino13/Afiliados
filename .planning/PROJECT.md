# Nexus OpenSquad

Máquina autônoma de curadoria e criação de conteúdo para Afiliados e Profissionais de Marketing.

## Visão do Produto
O Nexus OpenSquad automatiza a jornada de marketing de afiliados, desde a mineração de produtos em alta até a criação de campanhas completas (copy e visual), permitindo que o usuário foque em estratégia e escala.

## Requirements

### Validated
- ✓ Setup Full-Stack (Vite + React + Node/Express)
- ✓ Integração com Gemini (Scout, Strategist, Creative)
- ✓ Dashboard funcional com Radar de Produtos
- ✓ Scout Autônomo em background (4h interval)

### Active
- [ ] Geração real de imagens via API (Fal.ai/FLUX)
- [ ] Exportação real em ZIP dos materiais
- [ ] Onboarding e Autenticação (Fase 2)
- [ ] Agente Media Buyer (Ads)

### Out of Scope
- [ ] Publicação direta em APIs de Redes Sociais (Fase 3)

## Key Decisions
| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Vite + React | Performance e rapidez de desenvolvimento | Implementado |
| Node/Express | Motor leve para orquestração de agentes | Implementado |
| Gemini 2.5 Flash | Excelente custo-benefício e velocidade para prompts longos | Implementado |
| Fal.ai (FLUX) | Qualidade superior e velocidade na geração de imagens | Pendente |

## Evolution
Este documento evolui a cada transição de fase.
