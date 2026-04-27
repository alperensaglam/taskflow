"use client";

import { useState } from "react";
import { createCard } from "@/app/dashboard/board/[boardId]/actions";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";

interface AddCardFormProps {
  columnId: string;
  boardId: string;
}

export function AddCardForm({ columnId, boardId }: AddCardFormProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      await createCard(columnId, boardId, title);
      setTitle("");
      setIsAdding(false);
      toast.success("Kart eklendi.");
    } catch {
      toast.error("Kart eklenemedi.");
    } finally {
      setLoading(false);
    }
  }

  if (!isAdding) {
    return (
      <button
        onClick={() => setIsAdding(true)}
        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-white/5 hover:text-slate-300"
      >
        <Plus className="h-4 w-4" />
        Kart Ekle
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Kart başlığı girin..."
        className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/20"
        rows={2}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
          if (e.key === "Escape") {
            setIsAdding(false);
            setTitle("");
          }
        }}
      />
      <div className="flex items-center gap-2">
        <Button
          type="submit"
          size="sm"
          disabled={loading || !title.trim()}
          className="bg-indigo-600 text-white hover:bg-indigo-500"
        >
          {loading ? "Ekleniyor..." : "Ekle"}
        </Button>
        <button
          type="button"
          onClick={() => {
            setIsAdding(false);
            setTitle("");
          }}
          className="rounded-md p-1.5 text-slate-400 hover:bg-white/5 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}
