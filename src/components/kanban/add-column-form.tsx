"use client";

import { useState } from "react";
import { createColumn } from "@/app/dashboard/board/[boardId]/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";

interface AddColumnFormProps {
  boardId: string;
}

export function AddColumnForm({ boardId }: AddColumnFormProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      await createColumn(boardId, title);
      setTitle("");
      setIsAdding(false);
      toast.success("Sütun eklendi.");
    } catch {
      toast.error("Sütun eklenemedi.");
    } finally {
      setLoading(false);
    }
  }

  if (!isAdding) {
    return (
      <button
        onClick={() => setIsAdding(true)}
        className="flex h-12 w-[320px] flex-shrink-0 items-center gap-2 rounded-2xl border-2 border-dashed border-white/[0.06] px-4 text-sm text-slate-500 transition-all hover:border-indigo-500/20 hover:bg-indigo-500/5 hover:text-indigo-400"
      >
        <Plus className="h-4 w-4" />
        Sütun Ekle
      </button>
    );
  }

  return (
    <div className="w-[320px] flex-shrink-0 rounded-2xl border border-white/[0.06] bg-slate-900/50 p-3 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Sütun adı..."
          className="border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus:border-indigo-500"
          onKeyDown={(e) => {
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
    </div>
  );
}
