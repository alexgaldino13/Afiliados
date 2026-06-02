import React, { useState, useEffect, useRef } from 'react';
import { useSquad } from '../context/SquadContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Send, User, Cpu, Sparkles, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
  agent_type?: string;
}

export const SquadChat = ({ contextId, contextType = 'general' }: { contextId?: string, contextType?: string }) => {
  const { chatWithSquad, profile } = useSquad();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel('chat_messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `user_id=eq.${user?.id}`
      }, (payload) => {
        const newMessage = payload.new as Message;
        setMessages(prev => {
          if (prev.find(m => m.id === newMessage.id)) return prev;
          return [...prev, newMessage];
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [contextId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchMessages = async () => {
    if (!user) return;

    let query = supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (contextId) {
      query = query.eq('context_id', contextId);
    }

    const { data, error } = await query;
    if (error) console.error("Error fetching messages:", error);
    else setMessages(data || []);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user || isLoading) return;

    const userMsg = input;
    setInput('');
    setIsLoading(true);

    try {
      // 1. Save user message to DB
      const { data: savedMsg, error } = await supabase
        .from('chat_messages')
        .insert({
          user_id: user.id,
          role: 'user',
          content: userMsg,
          context_id: contextId,
          context_type: contextType,
          agent_type: 'orchestrator'
        })
        .select()
        .single();

      if (error) throw error;

      // 2. Call AI Agent
      const response = await chatWithSquad([...messages, { role: 'user', content: userMsg }], {
        profile,
        contextId,
        contextType
      });

      // 3. Save assistant message to DB
      await supabase
        .from('chat_messages')
        .insert({
          user_id: user.id,
          role: 'assistant',
          content: response.content || response.text || "Desculpe, tive um problema ao processar sua solicitação.",
          context_id: contextId,
          context_type: contextType,
          agent_type: response.agent || 'orchestrator'
        });

    } catch (err) {
      console.error("Chat error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-surface-container-low rounded-[2rem] border border-black/5 overflow-hidden shadow-inner">
      {/* Header */}
      <div className="p-4 border-b border-black/5 flex items-center justify-between bg-white/50 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-xl text-primary">
            <Cpu className="w-4 h-4" />
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-on-surface">Canal Lala Squad</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-bold text-green-600 uppercase">Agentes Online</span>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
            <Sparkles className="w-12 h-12 text-primary mb-4" />
            <p className="text-sm font-bold">Inicie uma conversa com seu Squad.</p>
            <p className="text-[10px] uppercase tracking-widest mt-2">Diga qual seu objetivo hoje.</p>
          </div>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              "flex gap-3 max-w-[85%]",
              m.role === 'user' ? "ml-auto flex-row-reverse" : ""
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
              m.role === 'user' ? "bg-primary text-white" : "bg-white text-primary border border-black/5"
            )}>
              {m.role === 'user' ? <User className="w-4 h-4" /> : <Cpu className="w-4 h-4" />}
            </div>
            <div className={cn(
              "p-4 rounded-2xl text-sm leading-relaxed",
              m.role === 'user'
                ? "bg-primary text-white rounded-tr-none font-medium"
                : "bg-white text-on-surface border border-black/5 rounded-tl-none shadow-sm"
            )}>
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-xl bg-white text-primary border border-black/5 flex items-center justify-center shadow-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-white/50 p-4 rounded-2xl rounded-tl-none border border-black/5 flex gap-1">
              <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white/50 border-t border-black/5">
        <div className="relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Digite sua missão ou dúvida..."
            className="w-full bg-white border border-black/5 rounded-2xl pl-6 pr-14 py-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none shadow-sm group-hover:border-primary/30"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-2 bottom-2 px-4 bg-primary text-white rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
