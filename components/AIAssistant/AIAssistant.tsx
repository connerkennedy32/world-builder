"use client";

import { useState, useRef, useEffect, useContext, useMemo } from "react";
import {
  X,
  Send,
  RefreshCw,
  Globe,
  ChevronDown,
  ChevronUp,
  FileText,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Markdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { GlobalContext } from "@/components/GlobalContextProvider";
import useWorldContext from "@/hooks/useWorldContext";
import useGetItemList from "@/hooks/useGetItemList";
import { tiptapToText } from "@/lib/tiptap-to-text";
import { useRouter } from "next/navigation";
import type { ChatMessage } from "@/lib/ai/types";
import type { JSONContent } from "@tiptap/react";

interface Message {
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
}

interface PinnedPage {
  id: string;
  title: string;
  content: string;
}

type Provider = "claude" | "openai";

const MODELS: Record<Provider, { value: string; label: string }[]> = {
  claude: [
    { value: "claude-haiku-4-5-20251001", label: "Haiku (fast)" },
    { value: "claude-sonnet-4-6", label: "Sonnet" },
    { value: "claude-opus-4-7", label: "Opus (best)" },
  ],
  openai: [
    { value: "gpt-4o-mini", label: "4o mini (fast)" },
    { value: "gpt-4o", label: "4o" },
    { value: "gpt-4.5-preview", label: "4.5 preview" },
    { value: "o4-mini", label: "o4 mini" },
    { value: "o3", label: "o3" },
    { value: "o3-mini", label: "o3 mini" },
    { value: "o1", label: "o1" },
    { value: "gpt-5", label: "GPT-5" },
    { value: "gpt-5-mini", label: "GPT-5 mini" },
  ],
};

function flattenPages(items: any[]): { id: string; title: string }[] {
  return items.flatMap((item) => [
    ...(item.itemType === "PAGE" ? [{ id: item.id, title: item.title }] : []),
    ...flattenPages(item.children || []),
  ]);
}

export function AIAssistant({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [provider, setProvider] = useState<Provider>("openai");
  const [model, setModel] = useState("gpt-5-mini");
  const [generatingContext, setGeneratingContext] = useState(false);
  const [contextExpanded, setContextExpanded] = useState(false);
  const [showPasteDraft, setShowPasteDraft] = useState(false);
  const [draftText, setDraftText] = useState("");
  const [draftFileName, setDraftFileName] = useState("");
  const [draftWordCount, setDraftWordCount] = useState(0);
  const [pinnedPages, setPinnedPages] = useState<PinnedPage[]>([]);
  const [slashMenuIndex, setSlashMenuIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { data: worldContext, invalidate: invalidateWorldContext } =
    useWorldContext();
  const { data: itemList = [] } = useGetItemList();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const allPages = useMemo(() => flattenPages(itemList), [itemList]);

  // Detect slash command: triggers when input ends with /word (no spaces after slash)
  const slashMatch = input.match(/(^|\s)\/([\w]*)$/);
  const showSlashMenu = !!slashMatch;
  const slashQuery = slashMatch ? slashMatch[2].toLowerCase() : "";

  const filteredPages = useMemo(() => {
    if (!showSlashMenu) return [];
    return allPages
      .filter((p) => !pinnedPages.some((pp) => pp.id === p.id))
      .filter((p) => p.title.toLowerCase().includes(slashQuery))
      .slice(0, 6);
  }, [showSlashMenu, slashQuery, allPages, pinnedPages]);

  useEffect(() => {
    setSlashMenuIndex(0);
  }, [filteredPages.length]);

  const selectPage = async (page: { id: string; title: string }) => {
    const slashIndex = input.lastIndexOf("/");
    setInput(input.slice(0, slashIndex).trimEnd());
    setSlashMenuIndex(0);

    try {
      const res = await fetch(`/api/items/${page.id}`);
      const data = await res.json();
      const content = tiptapToText(data.content as JSONContent | null);
      setPinnedPages((prev) => [
        ...prev,
        { id: page.id, title: page.title, content },
      ]);
    } catch {
      setPinnedPages((prev) => [
        ...prev,
        { id: page.id, title: page.title, content: "" },
      ]);
    }
  };

  const removePinnedPage = (id: string) => {
    setPinnedPages((prev) => prev.filter((p) => p.id !== id));
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: Message = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    const assistantMsg: Message = {
      role: "assistant",
      content: "",
      streaming: true,
    };
    setMessages((prev) => [...prev, assistantMsg]);

    try {
      const history: ChatMessage[] = newMessages.slice(0, -1).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history,
          provider,
          model,
          pinnedPagesContent: pinnedPages.map(({ title, content }) => ({
            title,
            content,
          })),
        }),
      });

      if (!res.ok || !res.body) throw new Error("Stream failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: accumulated,
            streaming: true,
          };
          return updated;
        });
      }

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: accumulated,
          streaming: false,
        };
        return updated;
      });
    } catch (err) {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "Something went wrong. Please try again.",
          streaming: false,
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateWorldContext = async (draftOverride?: string) => {
    setGeneratingContext(true);
    try {
      const body: Record<string, unknown> = { provider, model };
      if (draftOverride) body.draftText = draftOverride;
      const res = await fetch("/api/world-context", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok || !res.body) throw new Error("Failed to generate");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done } = await reader.read();
        if (done) break;
        decoder.decode(undefined, { stream: true });
      }
      await invalidateWorldContext();
      setShowPasteDraft(false);
      setDraftText("");
    } catch {
      // silent
    } finally {
      setGeneratingContext(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setDraftText(text);
      setDraftFileName(file.name);
      setDraftWordCount(text.trim().split(/\s+/).length);
    };
    reader.readAsText(file);
  };

  const handleDraftSubmit = () => {
    if (!draftText.trim()) return;
    generateWorldContext(draftText);
  };

  const clearDraft = () => {
    setDraftText("");
    setDraftFileName("");
    setDraftWordCount(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <motion.div
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-y-0 right-0 h-svh w-[420px] bg-white border-l border-gray-200 shadow-xl flex flex-col z-40"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900">Story Assistant</span>
          <select
            value={provider}
            onChange={(e) => {
              const p = e.target.value as Provider;
              setProvider(p);
              setModel(MODELS[p][0].value);
            }}
            className="text-xs border border-gray-200 rounded px-1.5 py-0.5 bg-gray-50 text-gray-600"
          >
            <option value="claude">Claude</option>
            <option value="openai">OpenAI</option>
          </select>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="text-xs border border-gray-200 rounded px-1.5 py-0.5 bg-gray-50 text-gray-600"
          >
            {MODELS[provider].map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* World Context Panel */}
      <div className="border-b border-gray-100 bg-gray-50">
        <button
          onClick={() => setContextExpanded((prev) => !prev)}
          className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Globe
              size={14}
              className={worldContext ? "text-green-500" : "text-gray-400"}
            />
            <span className="font-medium">World Context</span>
            {worldContext && (
              <span className="text-xs text-green-600 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded-full">
                Active
              </span>
            )}
            {!worldContext && (
              <span className="text-xs text-gray-400">Not generated</span>
            )}
          </div>
          {contextExpanded ? (
            <ChevronUp size={14} />
          ) : (
            <ChevronDown size={14} />
          )}
        </button>

        <AnimatePresence>
          {contextExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-3 space-y-2">
                <p className="text-xs text-gray-500">
                  {worldContext
                    ? "The assistant uses this to keep suggestions consistent with your story."
                    : "Generate a World Context from your existing pages so the assistant understands your story."}
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-7 flex-1"
                    onClick={() => generateWorldContext()}
                    disabled={generatingContext}
                  >
                    {generatingContext && !showPasteDraft ? (
                      <>
                        <RefreshCw size={12} className="mr-1.5 animate-spin" />
                        Generating…
                      </>
                    ) : worldContext ? (
                      <>
                        <RefreshCw size={12} className="mr-1.5" />
                        Regenerate from pages
                      </>
                    ) : (
                      <>
                        <Globe size={12} className="mr-1.5" />
                        Generate from pages
                      </>
                    )}
                  </Button>
                  {worldContext && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs h-7"
                      onClick={() => {
                        router.push(`/page/${worldContext.id}`);
                        onClose();
                      }}
                    >
                      View
                    </Button>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs h-7 w-full justify-start text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPasteDraft((prev) => !prev)}
                  disabled={generatingContext}
                >
                  {showPasteDraft
                    ? "↑ Hide draft paste"
                    : "↓ Paste draft manuscript"}
                </Button>
                <AnimatePresence>
                  {showPasteDraft && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden space-y-2"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".txt,.md,.markdown"
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={generatingContext}
                      />
                      {draftFileName ? (
                        <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg">
                          <FileText
                            size={14}
                            className="text-gray-400 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-700 truncate">
                              {draftFileName}
                            </p>
                            <p className="text-xs text-gray-400">
                              ~{Math.round(draftWordCount / 1000)}k words
                            </p>
                          </div>
                          <button
                            onClick={clearDraft}
                            className="text-gray-400 hover:text-gray-600"
                            disabled={generatingContext}
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          disabled={generatingContext}
                          className="w-full flex flex-col items-center gap-1.5 px-3 py-4 border border-dashed border-gray-300 rounded-lg text-gray-400 hover:border-gray-400 hover:text-gray-500 transition-colors"
                        >
                          <Upload size={16} />
                          <span className="text-xs">
                            Select .txt or .md file
                          </span>
                        </button>
                      )}
                      <Button
                        size="sm"
                        className="text-xs h-7 w-full"
                        onClick={handleDraftSubmit}
                        disabled={generatingContext || !draftText.trim()}
                      >
                        {generatingContext ? (
                          <>
                            <RefreshCw
                              size={12}
                              className="mr-1.5 animate-spin"
                            />
                            Generating…
                          </>
                        ) : (
                          "Build World Context"
                        )}
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 text-sm mt-12 space-y-3">
            <p className="font-medium text-gray-500">
              Ask me anything about your story
            </p>
            <div className="space-y-1.5 text-xs text-gray-400">
              <p
                className="cursor-pointer hover:text-gray-600 transition-colors"
                onClick={() =>
                  setInput("What physical traits would fit this character?")
                }
              >
                &ldquo;What physical traits would fit this character?&rdquo;
              </p>
              <p
                className="cursor-pointer hover:text-gray-600 transition-colors"
                onClick={() => setInput("Suggest 3 ways to end this chapter")}
              >
                &ldquo;Suggest 3 ways to end this chapter&rdquo;
              </p>
              <p
                className="cursor-pointer hover:text-gray-600 transition-colors"
                onClick={() => setInput("What's missing from this scene?")}
              >
                &ldquo;What&apos;s missing from this scene?&rdquo;
              </p>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm ${
                msg.role === "user"
                  ? "bg-gray-900 text-white rounded-br-sm"
                  : "bg-gray-100 text-gray-800 rounded-bl-sm"
              }`}
            >
              {msg.role === "assistant" ? (
                <div className="prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2">
                  <Markdown>
                    {msg.content || (msg.streaming ? "…" : "")}
                  </Markdown>
                </div>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-gray-100 bg-white">
        {/* Pinned page chips */}
        {pinnedPages.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {pinnedPages.map((page) => (
              <span
                key={page.id}
                className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-2 py-0.5"
              >
                <FileText size={10} />
                <span className="max-w-[120px] truncate">{page.title}</span>
                <button
                  onClick={() => removePinnedPage(page.id)}
                  className="text-blue-400 hover:text-blue-600 ml-0.5"
                >
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Slash command menu */}
        <div className="relative">
          <AnimatePresence>
            {showSlashMenu && filteredPages.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.1 }}
                className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-10"
              >
                <p className="px-3 py-1.5 text-[11px] text-gray-400 border-b border-gray-100">
                  Add page to context
                </p>
                {filteredPages.map((page, i) => (
                  <button
                    key={page.id}
                    onClick={() => selectPage(page)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors ${
                      i === slashMenuIndex
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <FileText size={13} className="shrink-0 text-gray-400" />
                    <span className="truncate">{page.title}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-2 items-end">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (showSlashMenu && filteredPages.length > 0) {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setSlashMenuIndex((i) =>
                      Math.min(i + 1, filteredPages.length - 1)
                    );
                    return;
                  }
                  if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setSlashMenuIndex((i) => Math.max(i - 1, 0));
                    return;
                  }
                  if (e.key === "Enter") {
                    e.preventDefault();
                    selectPage(filteredPages[slashMenuIndex]);
                    return;
                  }
                  if (e.key === "Escape") {
                    e.preventDefault();
                    setInput((prev) => prev.replace(/\/([\w]*)$/, ""));
                    return;
                  }
                }
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Ask about your story… or / to add a page"
              className="resize-none text-sm min-h-[44px] max-h-[120px]"
              rows={1}
              disabled={isLoading}
            />
            <Button
              size="sm"
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="h-[44px] w-[44px] p-0 shrink-0"
            >
              <Send size={16} />
            </Button>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-1.5">
          Shift+Enter for newline · / to add page context
        </p>
      </div>
    </motion.div>
  );
}
