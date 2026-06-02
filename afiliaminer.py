import requests
import json
import os
from datetime import datetime

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# CONFIGURAÇÃO
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OLLAMA_URL  = "http://localhost:11434/api/generate"
MODELO      = "llama3.1:8b"
PASTA_RAIZ  = r"D:\projetos\afiliado"
TAG_AMAZON  = "galdino1307-20"

PASTAS = [
    r"modulos\M1_garimpeiro",
    r"modulos\M2_analise",
    r"modulos\M3_pomelli",
    r"modulos\M4_estrategia",
    r"modulos\M5_relatorio",
    r"campanhas",
    r"logs",
]

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# CONTEXTO MESTRE (lido pelo modelo)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MASTER = f"""
PROJETO: LALAFILIADOS / GRUPO LALA MIX
DONO: Galdino — afiliado brasileiro iniciante a intermediário
TAG AMAZON: {TAG_AMAZON}
OBJETIVO: Encontrar produtos/infoprodutos com alto potencial de lucro e entregar briefing completo de campanha.
CANAL: Orgânico — Blogger + Google Sites
FOCO: Brasil (expansão global futura)
NICHOS: Finanças pessoais, Saúde/Emagrecimento, Produtividade, Relacionamento, Educação online
PLATAFORMAS: Amazon Associates, Hotmart, Kiwify, Monetizze, Mercado Livre
FASE ATUAL: apenas orgânico, sem tráfego pago

REGRAS:
- Responda SEMPRE em português brasileiro
- NUNCA invente links de afiliado — use [SEU LINK AFILIADO]
- Links Amazon SEMPRE com ?tag={TAG_AMAZON}
- Seja direto e orientado a resultado
- NÃO faça perguntas, execute e entregue
"""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# PROMPTS DOS 5 AGENTES
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
def prompt_agente1(nicho):
    return f"""
{MASTER}

Você é o AGENTE 1 — GARIMPEIRO.
Nicho recebido: {nicho}

Liste os 5 melhores produtos ou infoprodutos deste nicho no Brasil agora.
Para cada um informe:
- Nome do produto
- Plataforma (Amazon/Hotmart/Kiwify/Mercado Livre)
- Tipo (físico ou digital)
- Faixa de preço estimada (R$)
- Comissão estimada para afiliado (% ou R$)
- Motivo de estar em alta agora (1 linha)

Seja objetivo. Sem introduções. Entregue a lista diretamente.
"""

def prompt_agente2(resultado_m1):
    return f"""
{MASTER}

Você é o AGENTE 2 — ANALISTA DE OPORTUNIDADE.
Recebeu esta lista de produtos do Garimpeiro:

{resultado_m1}

Pontue cada produto com score de 0 a 100 usando estes pesos:
- Comissão em R$ por venda: 30 pts
- Volume de busca / demanda: 25 pts
- Nível de concorrência (inverso — menor concorrência = mais pontos): 25 pts
- Tendência crescente agora: 20 pts

Para cada produto entregue:
- Score total
- Justificativa em 2 linhas
- Veredicto: OURO / PRATA / BRONZE / DESCARTADO

No final destaque o TOP 1 com justificativa clara.
Sem introduções. Entregue direto.
"""

def prompt_agente3(top1):
    return f"""
{MASTER}

Você é o AGENTE 3 — POMELLI ENGINE.
Produto TOP 1 recebido: {top1}

Extraia o DNA completo de marketing deste produto:

- BRAND VOICE: tom da comunicação (ex: científico, motivacional, urgente, empático)
- USP: o que diferencia este produto em 1 frase
- MARKET GAP: o que os concorrentes NÃO oferecem que este produto resolve
- TOP 3 DORES DO AVATAR: as 3 principais frustrações de quem compra este tipo de produto
- PERFIL DO COMPRADOR: idade aproximada, gênero predominante, nível de consciência do problema

Sem introduções. Entregue o DNA direto.
"""

def prompt_agente4(dna):
    return f"""
{MASTER}

Você é o AGENTE 4 — ESTRATEGISTA DE CAMPANHA.
DNA do produto recebido:

{dna}

Monte o plano de campanha orgânica:

- HOOK PRINCIPAL: 1 frase irresistível para abrir post/artigo/reels
- ÂNGULO: abordagem emocional ou racional + motivo da escolha
- PÚBLICO-ALVO: descreva em 3 linhas quem é essa pessoa
- CANAL RECOMENDADO: Blogger SEO / Reels / TikTok / WhatsApp / YouTube Shorts
- FORMATO: artigo de blog / vídeo curto / carrossel / comparativo
- PALAVRA-CHAVE SEO: termo exato que o público pesquisa no Google
- HEADLINE DO ARTIGO: título completo otimizado para SEO

Sem introduções. Entregue o plano direto.
"""

def prompt_agente5(m1, m2, m3, m4, nicho):
    return f"""
{MASTER}

Você é o AGENTE 5 — RELATOR.
Consolide tudo num card final de oportunidade.

DADOS RECEBIDOS:
--- GARIMPEIRO ---
{m1}

--- ANÁLISE ---
{m2}

--- DNA ---
{m3}

--- ESTRATÉGIA ---
{m4}

Entregue o card EXATAMENTE neste formato:

═══════════════════════════════════════
🎯 CARD DE OPORTUNIDADE — [NOME DO PRODUTO]
Score: [X]/100 | [OURO/PRATA/BRONZE]
Nicho: {nicho}
Data: {datetime.now().strftime('%d/%m/%Y')}
═══════════════════════════════════════

📦 PRODUTO
  Nome:
  Plataforma:
  Preço médio: R$
  Comissão estimada: R$ por venda

🧬 DNA DO PRODUTO
  Brand Voice:
  USP:
  Market Gap:
  Dores do avatar: 1) 2) 3)
  Perfil do comprador:

📣 CAMPANHA RECOMENDADA
  Hook:
  Ângulo:
  Canal:
  Formato:

📝 PARA O BLOGGER
  Palavra-chave:
  Headline:

🔗 LINKS
  Página de vendas: [buscar URL real se possível]
  Afiliado Amazon (se aplicável): https://amazon.com.br/dp/[CODIGO]?tag={TAG_AMAZON}
  Cadastro afiliado: [URL do programa]

⚡ PRÓXIMO PASSO IMEDIATO:
  [1 ação concreta que o Galdino deve fazer agora]

═══════════════════════════════════════
"""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# FUNÇÕES UTILITÁRIAS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
def criar_estrutura():
    for pasta in PASTAS:
        caminho = os.path.join(PASTA_RAIZ, pasta)
        os.makedirs(caminho, exist_ok=True)

    master_path = os.path.join(PASTA_RAIZ, "MASTER.md")
    if not os.path.exists(master_path):
        with open(master_path, "w", encoding="utf-8") as f:
            f.write(MASTER)
        print(f"  📄 MASTER.md criado em {master_path}")

def salvar_modulo(subpasta, nome_arquivo, conteudo):
    caminho = os.path.join(PASTA_RAIZ, subpasta, nome_arquivo)
    with open(caminho, "w", encoding="utf-8") as f:
        f.write(conteudo)
    return caminho

def chamar_ollama(prompt, modulo_nome):
    print(f"\n  ⏳ Processando {modulo_nome}...")
    try:
        resposta = requests.post(OLLAMA_URL, json={
            "model": MODELO,
            "prompt": prompt,
            "stream": False,
            "options": {"num_ctx": 8192, "temperature": 0.7}
        }, timeout=300)
        resposta.raise_for_status()
        return resposta.json().get("response", "").strip()
    except requests.exceptions.ConnectionError:
        print("\n  ❌ ERRO: Ollama não está rodando.")
        print("  👉 Abra outro terminal e rode: ollama serve")
        exit(1)
    except Exception as e:
        print(f"\n  ❌ ERRO no {modulo_nome}: {e}")
        return f"[Erro ao processar {modulo_nome}]"

def banner(texto, icone="✅"):
    linha = "─" * 50
    print(f"\n┌{linha}┐")
    print(f"│ {icone} {texto:<47}│")
    print(f"└{linha}┘")

def log(mensagem):
    log_path = os.path.join(PASTA_RAIZ, "logs", "execucoes.log")
    with open(log_path, "a", encoding="utf-8") as f:
        f.write(f"[{datetime.now().strftime('%d/%m/%Y %H:%M')}] {mensagem}\n")

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# PIPELINE PRINCIPAL
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
def rodar_pipeline(nicho):
    data = datetime.now().strftime("%Y%m%d_%H%M")
    slug = nicho.lower().replace(" ", "_")[:30]

    print(f"\n🚀 Iniciando AfiliaMiner para: '{nicho}'")
    log(f"Pipeline iniciado — nicho: {nicho}")

    # ── MÓDULO 1 ──────────────────────────────────────
    banner("MÓDULO 1 — GARIMPEIRO", "🔍")
    m1 = chamar_ollama(prompt_agente1(nicho), "Módulo 1")
    path1 = salvar_modulo(r"modulos\M1_garimpeiro", f"resultado_{slug}_{data}.md", m1)
    print(f"\n{m1}")
    print(f"\n  📁 Salvo em: {path1}")
    print("  ⏭️  Processando Módulo 2...")

    # ── MÓDULO 2 ──────────────────────────────────────
    banner("MÓDULO 2 — ANALISTA DE OPORTUNIDADE", "📊")
    m2 = chamar_ollama(prompt_agente2(m1), "Módulo 2")
    path2 = salvar_modulo(r"modulos\M2_analise", f"scores_{slug}_{data}.md", m2)
    print(f"\n{m2}")
    print(f"\n  📁 Salvo em: {path2}")

    # Extrai o TOP 1 para passar adiante
    top1 = nicho  # fallback
    for linha in m2.split("\n"):
        if "TOP 1" in linha.upper() or "OURO" in linha.upper():
            top1 = linha.strip()
            break
    print("  ⏭️  Processando Módulo 3...")

    # ── MÓDULO 3 ──────────────────────────────────────
    banner("MÓDULO 3 — POMELLI ENGINE (DNA)", "🧬")
    m3 = chamar_ollama(prompt_agente3(top1), "Módulo 3")
    path3 = salvar_modulo(r"modulos\M3_pomelli", f"dna_{slug}_{data}.md", m3)
    print(f"\n{m3}")
    print(f"\n  📁 Salvo em: {path3}")
    print("  ⏭️  Processando Módulo 4...")

    # ── MÓDULO 4 ──────────────────────────────────────
    banner("MÓDULO 4 — ESTRATEGISTA DE CAMPANHA", "📣")
    m4 = chamar_ollama(prompt_agente4(m3), "Módulo 4")
    path4 = salvar_modulo(r"modulos\M4_estrategia", f"campanha_{slug}_{data}.md", m4)
    print(f"\n{m4}")
    print(f"\n  📁 Salvo em: {path4}")
    print("  ⏭️  Gerando Card Final...")

    # ── MÓDULO 5 ──────────────────────────────────────
    banner("MÓDULO 5 — CARD FINAL (RELATOR)", "🎯")
    m5 = chamar_ollama(prompt_agente5(m1, m2, m3, m4, nicho), "Módulo 5")
    path5 = salvar_modulo(r"modulos\M5_relatorio", f"card_{slug}_{data}.md", m5)
    path_camp = salvar_modulo(r"campanhas", f"{slug}_pronto_{data}.md", m5)
    print(f"\n{m5}")
    print(f"\n  📁 Relatório: {path5}")
    print(f"  📁 Campanha:  {path_camp}")

    log(f"Pipeline concluído — nicho: {nicho} | arquivos em {data}")
    banner("PIPELINE CONCLUÍDO!", "✅")
    print(f"\n  Todos os módulos salvos em: {PASTA_RAIZ}")
    print(f"  Card final em: {path_camp}\n")

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# ENTRADA DO USUÁRIO
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
def main():
    print("=" * 52)
    print("   AFILIAMINER — GRUPO LALA MIX")
    print("   Sistema de Inteligência de Afiliados")
    print("=" * 52)

    print("\n  Criando estrutura de pastas...")
    criar_estrutura()
    print(f"  ✅ Estrutura pronta em {PASTA_RAIZ}")

    print("\n  Modos de uso:")
    print("  • Digite um nicho:    'finanças pessoais'")
    print("  • Melhores nichos:    'melhores nichos'")
    print("  • Sair:               'sair'\n")

    while True:
        nicho = input("  Nicho ou comando → ").strip()

        if not nicho:
            continue
        if nicho.lower() == "sair":
            print("\n  Até a próxima! 👋\n")
            break
        elif nicho.lower() == "melhores nichos":
            rodar_pipeline("melhores nichos para afiliados no Brasil em 2026")
        else:
            rodar_pipeline(nicho)

        print("\n" + "─" * 52)
        continuar = input("  Analisar outro nicho? (s/n) → ").strip().lower()
        if continuar != "s":
            print("\n  Encerrando. Arquivos salvos em D:\\projetos\\afiliado\\ 👋\n")
            break

if __name__ == "__main__":
    main()
