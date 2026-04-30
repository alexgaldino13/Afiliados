# Nexus OpenSquad - Documentação Viva do Projeto

Este documento centraliza todas as intenções, ideias, o progresso realizado e o roadmap futuro do projeto. Ele serve como o cérebro do produto para o desenvolvedor e para a Inteligência Artificial.

## 🎯 Visão do Produto
O Nexus OpenSquad é uma máquina autônoma de curadoria e criação de conteúdo para Afiliados e Profissionais de Marketing. O objetivo é remover o trabalho braçal (mineração de ofertas, criação de copy, design) e focar na **Estratégia e Escala**. 

**Como funciona a jornada ideal?**
1. O sistema minera produtos em alta nas plataformas (Hotmart, Amazon, TikTok Shop) automaticamente.
2. O usuário revisa e aprova as oportunidades no **Radar Nexus**.
3. O Esquadrão de IA (*Strategist* e *Creative*) entra em ação:
   - Extrai o **Business DNA** da oferta (Voz da marca, Dores, Desejos).
   - Cria Campanhas Completas (Copys AIDA de alta conversão, Prompts Visuais para Midjourney/Flux).
4. O usuário aprova e os arquivos vão para a Fila de Publicação.
5. (Fase 2) O sistema orquestra e publica essas campanhas nas redes sociais ou sobe anúncios via Agente *Media Buyer*.

---

## ✅ O que já foi feito (Concluído)

- **Setup Full-Stack (Fase 1):**
  - Transformamos o protótipo visual estático gerado pelo AI Studio em uma aplicação Vite + React.
  - Implementamos um **Backend Node/Express** (porta 3001) para servir de motor da IA.
  - Configuramos o `concurrently` para rodar front e back juntos com `npm run dev`.

- **Integração do Motor de IA (Gemini):**
  - O backend agora utiliza o `@google/genai` (modelo `gemini-2.5-flash`).
  - Agente **Scout**: Criado endpoint para minerar dados de produtos baseados em nichos.
  - Agente **Strategist**: Modificado com a arquitetura "Pomelli Engine" para identificar o *Business DNA* (Brand Voice, Valores Essenciais, USP) e o público-alvo.
  - Agente **Creative**: Utiliza o *Business DNA* para gerar legendas perfeitas e prompts gerativos.

- **Refatoração do Front-end (Context API):**
  - O estado centralizado vive agora em `SquadContext.tsx`.
  - A interface em `App.tsx` não usa mais dados estáticos para a Inteligência Artificial; os agentes alimentam a UI em tempo real.

- **Automação Diária (Scout Autônomo):**
  - Implementada uma rotina em background no backend (CRON-like com `setInterval`) que varre as plataformas a cada 4 horas e salva os resultados no banco de dados local (`server/data.json`).
  - Um endpoint `/api/force-scout` permite testar essa rotina manualmente.

- **Fila de Publicação (Export Mode):**
  - Adaptada para a Fase 1: os botões permitem "Exportar a Campanha" gerada.

---

## 🚀 O que está para fazer (Roadmap)

### Fase 1.5: Polimento Visual
- [ ] Integrar geradores reais de imagem via API (ex: FLUX via fal.ai ou OpenAI) na resposta do agente Creative para que a imagem já venha pronta.
- [ ] Funcionalidade de download em ZIP real na Fila de Publicação.

### Fase 2: O Ecossistema de Performance (Ads & Connections)
- [ ] **Onboarding & Autenticação:** Implementar login real (Firebase ou Supabase) para que cada afiliado tenha sua própria base de dados e tokens separados.
- [ ] **OAuth Social:** Conexões reais com TikTok, Instagram e Google via OAuth2.
- [ ] **Integração Oficial de Redes:** Publicação e agendamento nativo via APIs das redes.
- [ ] **Agente Media Buyer (Ads):** Um novo agente capaz de criar campanhas de anúncios (Tráfego Pago) consumindo APIs da Meta e analisando o ROAS/CPA.

---

*Documento mantido e atualizado continuamente pela IA do Nexus e pelo Engenheiro Responsável.*
