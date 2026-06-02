# Requirements: Nexus OpenSquad

## 1. Fase 1.5: Polimento e Exportação (Foco Atual)

### 1.1 Geração de Imagens
- **REQ-1.1.1**: O Agente Creative deve gerar um prompt visual otimizado.
- **REQ-1.1.2**: O sistema deve enviar esse prompt para a API Fal.ai (FLUX).
- **REQ-1.1.3**: A imagem retornada deve ser exibida no frontend em vez do placeholder.
- **REQ-1.1.4**: Deve haver um estado de loading visual enquanto a imagem é processada.

### 1.2 Exportação ZIP
- **REQ-1.2.1**: O usuário deve poder baixar um arquivo ZIP da campanha aprovada.
- **REQ-1.2.2**: O ZIP deve conter: `caption.txt`, `image.jpg`, e um `readme.md` básico.
- **REQ-1.2.3**: O processo de geração do ZIP deve ser eficiente.

## 2. Fase 2: Ecossistema de Performance (Futuro)

### 2.1 Autenticação
- **REQ-2.1.1**: Sistema de login seguro.
- **REQ-2.1.2**: Persistência de dados por usuário.

### 2.2 Conexões
- **REQ-2.2.1**: Integração com APIs oficiais (TikTok, Instagram).
