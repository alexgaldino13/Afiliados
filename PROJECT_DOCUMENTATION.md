# LALAFILIADOS - Documentação Viva do Projeto

Este documento centraliza todas as intenções, ideias, o progresso realizado e o roadmap futuro do projeto. Ele serve como o cérebro do produto para o desenvolvedor e para a Inteligência Artificial.

## 🎯 Visão do Produto
O LALAFILIADOS é uma máquina autônoma de curadoria e criação de conteúdo para Afiliados e Profissionais de Marketing. O objetivo é remover o trabalho braçal (mineração de ofertas, criação de copy, design) e focar na **Estratégia e Escala**. 

**Como funciona a jornada ideal?**
1. O sistema minera produtos em alta nas plataformas automaticamente ou aceita um link direto (Amazon/YouTube).
2. A **Pomelli Engine** disseca o Business DNA do produto instantaneamente.
3. O Esquadrão de IA (*Strategist* e *Creative*) orquestra a campanha multimodal (Imagem, Vídeo, Áudio, Copy).
4. O usuário aprova, agenda o lançamento ou exporta o pacote completo para subir nos canais (Ads/Orgânico).

---

## ✅ O que já foi feito (Concluído)

- **Setup Full-Stack & Segurança (Fase 1 e 2):**
  - Vite + React + Supabase Auth & Database (Cloud).
  - Backend Node/Express como motor de orquestração.
  - Sincronização em tempo real (Real-time updates) via PostgreSQL listeners.

- **Expansão Multimodal & Criativa (Fase 1.5):**
  - Geração automática de Imagem, Vídeo (5s) e Trilha Sonora.
  - **Pomelli Engine (Google Labs)**: Integração da lógica de extração de DNA (Brand Voice, USP, Market Gap).
  - **Fila de Lançamento Pro**: Sistema de agendamento e status de campanhas.
  - **Exportação Real**: Funcionalidade de download em ZIP real com todos os ativos e briefing.

- **Inteligência de Mercado & Dados:**
  - **Google Trends Integration**: Widget na dashboard mostrando termos em ascensão no nicho.
  - **Google Ads Engine**: Geração automática de Palavras-Chave (SEO/Ads), Títulos (30 caracteres) e Descrições.
  - **Amazon Auto-Tagging**: Integração com Associate ID (`galdino1307-20`) para geração de links automáticos.

- **Expansão de Conhecimento (Lala Academy):**
  - Criada a base de conhecimento proprietária onde o usuário injeta transcrições de cursos e frameworks próprios.

- **Interoperabilidade:**
  - **Bridge Roteirista**: Botão de exportação de briefing otimizado para o projeto "Roteirista".

- **Infraestrutura e Conectividade (Estabilidade Pro):**
  - **Conexão Universal**: Backend configurado para aceitar requisições de qualquer IP na rede local (Porta 3001).
  - **Pipeline Assíncrona**: O sistema agora cria o card da campanha instantaneamente (status 'draft') enquanto a IA processa mídias pesadas em background.
  - **Supabase Storage**: Integração total com Buckets para armazenamento permanente de mídias (evitando links expirados).
  - **Redundância IA (OpenRouter)**: Implementado sistema multimodelo com Claude 3.5 Sonnet (Copy) e GPT-4o (Estratégia).
  - **UI Blindada**: Proteção total contra "Telas em Branco" através de renderização defensiva.

---

## 🚀 Próximos Passos (Roadmap)

- **Fase 3: Automação Social Real**
  - Conexão oficial com APIs de redes sociais para postagem direta.
  - Webhooks para registro de conversões reais (Hotmart/Kiwify).

- **Fase 4: Escala e IA Buyer Real**
  - Integração com Meta Ads API para subir conjuntos de anúncios automaticamente.
  - O Agente **Media Buyer** passará a gerir o orçamento baseado no ROAS real do Tracker.

- **Refinamento de Onboarding:**
  - Onboarding 100% guiado por IA (concluído a lógica inicial).

---

## 🚀 O que está para fazer (Roadmap)

### Fase 2: O Ecossistema de Performance (Ads & Connections)
- [x] **Onboarding & Autenticação:** Login e Onboarding IA concluídos.
- [ ] **OAuth Social:** Conexões reais com TikTok, Instagram e Google via OAuth2.
- [ ] **Integração Oficial de Redes:** Publicação e agendamento nativo via APIs das redes.
- [ ] **Agente Media Buyer (Ads Real):** Consumir APIs da Meta para criação de campanhas em massa.

---

*Documento mantido e atualizado continuamente pela IA do Nexus e pelo Engenheiro Responsável.*
