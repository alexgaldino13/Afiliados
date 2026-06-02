import JSZip from 'jszip';

export async function createCampaignZip(item: any) {
  const zip = new JSZip();
  // ... resto do código continua igual, o Node 18+ já tem fetch nativo
  const folder = zip.folder(`lala-campaign-${item.id}`);

  // 1. Adicionar Copy em arquivo de texto
  const copyContent = `
TITULO: ${item.title}
DATA: ${new Date().toLocaleString()}

COPY AIDA:
${item.copy_aida?.text || 'Sem copy gerada'}

SEO / TAGS:
${item.copy_aida?.seo || ''}

BUSINESS DNA:
- Voz: ${item.business_dna?.brandVoice || 'N/A'}
- USP: ${item.business_dna?.uniqueSellingProposition || 'N/A'}

PLANO DE MIDIA:
- Sugestão Google Ads: R$ 50/dia
- Keywords: ${item.mediaPlan?.keywords?.join(', ') || 'N/A'}
  `;
  folder?.file("briefing_e_copy.txt", copyContent);

  // 2. Baixar e adicionar Assets (Imagens/Vídeos)
  if (item.assets && item.assets.length > 0) {
    for (const asset of item.assets) {
      try {
        const response = await fetch(asset.url);
        const buffer = await response.arrayBuffer();
        const extension = asset.type === 'video' ? 'mp4' : asset.type === 'audio' ? 'mp3' : 'jpg';
        folder?.file(`asset_${asset.id}.${extension}`, buffer);
      } catch (err) {
        console.error(`Falha ao baixar asset ${asset.url}`, err);
      }
    }
  }

  return await zip.generateAsync({ type: 'nodebuffer' });
}
