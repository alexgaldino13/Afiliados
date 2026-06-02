import React, { useState, useEffect } from 'react';
import { useSquad } from '../context/SquadContext';
import {
  BookOpen,
  Plus,
  Sparkles,
  Brain,
  ChevronRight,
  Trash2,
  Globe,
  Database,
  Search
} from 'lucide-react';
import { cn } from '../lib/utils';

export const AcademyView = () => {
  const { addKnowledge, getKnowledge } = useSquad();
  const [knowledgeList, setKnowledgeList] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newMethod, setNewMethod] = useState({ title: '', content: '', tags: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadKnowledge();
  }, []);

  const loadKnowledge = async () => {
    const data = await getKnowledge();
    setKnowledgeList(data);
  };

  const handleAdd = async () => {
    if (!newMethod.title || !newMethod.content) return;
    setLoading(true);
    try {
      const tags = newMethod.tags.split(',').map(t => t.trim());
      await addKnowledge(newMethod.title, newMethod.content, tags);
      setNewMethod({ title: '', content: '', tags: '' });
      setIsAdding(false);
      await loadKnowledge();
    } catch (err) {
      alert("Erro ao salvar método.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="text-left">
          <h1 className="font-headline font-black text-4xl tracking-tight text-on-surface">
            Lala Academy
          </h1>
          <p className="text-on-surface-variant font-body mt-1">
            Treine seu Squad com a sua própria metodologia e frameworks proprietários.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="px-8 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3"
        >
          <Plus className="w-5 h-5" />
          INJETAR MÉTODO
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Statistics / Status */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-gradient-to-br from-indigo-600 to-primary p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden text-left">
              <Brain className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10" />
              <div className="relative z-10">
                 <h3 className="text-xl font-black mb-2">Cérebro Central</h3>
                 <p className="text-indigo-100 text-sm font-medium mb-6">O Squad está operando com {knowledgeList.length} métodos proprietários.</p>
                 <div className="space-y-3">
                    <div className="flex items-center justify-between bg-white/10 p-3 rounded-xl border border-white/5 text-[10px] font-black uppercase tracking-widest">
                       <span>Afinidade Estratégica</span>
                       <span className="text-green-300">98% Match</span>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] border border-black/5 shadow-sm text-left">
              <h4 className="font-bold text-sm text-on-surface-variant uppercase tracking-widest mb-6 flex items-center gap-2">
                 <Database className="w-4 h-4 text-primary" /> Fontes Ativas
              </h4>
              <div className="space-y-4">
                 {[
                   { label: "Curso Hotmart", type: "Expert Knowledge", status: "Active" },
                   { label: "Kiwify Club", type: "Strategy Pool", status: "Synced" },
                   { label: "Framework Internacional", type: "Language Pack", status: "Active" }
                 ].map((s, i) => (
                   <div key={i} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <div>
                         <p className="text-xs font-bold text-on-surface">{s.label}</p>
                         <p className="text-[10px] text-on-surface-variant font-medium">{s.type}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Knowledge List */}
        <div className="lg:col-span-8 space-y-4">
          {knowledgeList.length === 0 && !isAdding && (
            <div className="py-20 text-center bg-surface-container-low rounded-[3rem] border border-dashed border-black/10">
               <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-4" />
               <h3 className="font-bold text-on-surface">Base de Conhecimento Vazia</h3>
               <p className="text-on-surface-variant text-sm mt-1">Adicione os scripts ou transcrições do seu curso aqui.</p>
            </div>
          )}

          {isAdding && (
            <div className="bg-white p-10 rounded-[3rem] border-2 border-primary shadow-2xl animate-in zoom-in-95 duration-300 mb-8">
               <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-black text-on-surface">Nova Metodologia</h3>
                  <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-slate-100 rounded-full"><ChevronRight className="w-6 h-6 rotate-90" /></button>
               </div>
               <div className="space-y-6 text-left">
                  <div>
                     <label className="text-[10px] font-black text-on-surface-variant uppercase ml-2">Título do Método</label>
                     <input
                        value={newMethod.title}
                        onChange={(e) => setNewMethod({...newMethod, title: e.target.value})}
                        placeholder="Ex: Framework de Copy para ClickBank"
                        className="w-full bg-surface-container-low border-0 rounded-2xl px-6 py-4 font-bold mt-2"
                     />
                  </div>
                  <div>
                     <label className="text-[10px] font-black text-on-surface-variant uppercase ml-2">Conteúdo / Transcrição</label>
                     <textarea
                        value={newMethod.content}
                        onChange={(e) => setNewMethod({...newMethod, content: e.target.value})}
                        placeholder="Cole aqui os insights, scripts ou a estrutura do seu curso..."
                        className="w-full bg-surface-container-low border-0 rounded-3xl px-6 py-4 font-medium mt-2 min-h-[200px]"
                     />
                  </div>
                  <button
                    onClick={handleAdd}
                    disabled={loading}
                    className="w-full py-5 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                    FUNDIR CONHECIMENTO AO SQUAD
                  </button>
               </div>
            </div>
          )}

          {knowledgeList.map((item) => (
            <div key={item.id} className="group bg-surface-container-lowest p-6 rounded-3xl border border-black/5 shadow-sm hover:shadow-md transition-all flex items-center justify-between text-left">
               <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                     <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                     <h4 className="font-bold text-on-surface">{item.title}</h4>
                     <p className="text-xs text-on-surface-variant font-medium mt-0.5 line-clamp-1 max-w-md">{item.content}</p>
                     <div className="flex gap-2 mt-2">
                        {item.tags?.map((t: string) => (
                          <span key={t} className="px-2 py-0.5 bg-surface-container-high rounded-md text-[8px] font-black uppercase text-on-surface-variant">#{t}</span>
                        ))}
                     </div>
                  </div>
               </div>
               <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-3 bg-surface-container-low text-on-surface-variant rounded-xl hover:text-error transition-colors">
                     <Trash2 className="w-4 h-4" />
                  </button>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
