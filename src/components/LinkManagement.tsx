import React, { useState } from "react";
import {
  Link as LinkIcon,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";
import { cn } from "../lib/utils";
import { useSquad } from "../context/SquadContext";

interface LinkManagementProps {
  links: any[]; // Legacy
  onAddLink: (link: any) => void;
}

export const LinkManagement = ({ links: legacyLinks, onAddLink }: LinkManagementProps) => {
  const { campaigns } = useSquad();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const trackingLinks = campaigns.map(c => ({
    id: c.id,
    title: c.title,
    trackingUrl: `http://localhost:3001/api/l/${c.id}`,
    destUrl: c.product?.affiliate_link || 'Link não configurado',
    clicks: c.clickCount || 0
  }));

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="text-left">
          <h1 className="font-headline font-black text-4xl tracking-tight text-on-surface">
            Meus Links Lala
          </h1>
          <p className="text-on-surface-variant font-body mt-1">
            Links otimizados com tracking e redirecionamento inteligente.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {trackingLinks.map((link) => (
          <div
            key={link.id}
            className="bg-surface-container-lowest p-6 rounded-3xl border border-black/5 shadow-sm flex flex-col md:flex-row items-center justify-between group hover:border-secondary/30 transition-all gap-6"
          >
            <div className="flex items-center gap-6 flex-1 text-left">
              <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary shrink-0">
                <LinkIcon className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-on-surface text-lg truncate">
                  {link.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-on-surface-variant font-medium mt-1">
                  <span className="shrink-0 font-bold text-secondary">Lala Link:</span>
                  <span className="truncate">{link.trackingUrl}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="flex-1 md:flex-none px-4 py-2 bg-surface-container-low rounded-xl text-left">
                <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Cliques</p>
                <div className="flex items-center gap-1.5 text-secondary font-black">
                   {link.clicks}
                </div>
              </div>

              <button
                onClick={() => handleCopy(link.id, link.trackingUrl)}
                className={cn(
                  "p-4 rounded-2xl transition-all flex items-center gap-2 font-bold text-xs",
                  copiedId === link.id
                    ? "bg-green-500 text-white"
                    : "bg-secondary text-white shadow-lg shadow-secondary/20 hover:scale-105"
                )}
              >
                {copiedId === link.id ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    COPIAR
                  </>
                )}
              </button>

              <a
                href={link.trackingUrl}
                target="_blank"
                rel="noreferrer"
                className="p-4 bg-surface-container-high text-on-surface-variant rounded-2xl hover:bg-surface-container-highest transition-colors"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>
        ))}
        {trackingLinks.length === 0 && (
          <div className="py-24 text-center bg-surface-container-low rounded-[2.5rem] border border-dashed border-black/10">
            <LinkIcon className="w-12 h-12 text-on-surface-variant/20 mx-auto mb-4" />
            <p className="text-on-surface-variant font-medium">
              Gere uma campanha para criar seu primeiro link de tracking.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
