"use client";

import { useState } from "react";
import {
  updateCard,
  deleteCard,
} from "@/app/dashboard/board/[boardId]/actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, FileText } from "lucide-react";
import { Card } from "@/lib/types";
import { toast } from "sonner";

interface EditCardDialogProps {
  card: Card;
  boardId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditCardDialog({
  card,
  boardId,
  open,
  onOpenChange,
}: EditCardDialogProps) {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || "");
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    if (!title.trim()) return;

    setLoading(true);
    try {
      await updateCard(card.id, boardId, {
        title: title.trim(),
        description: description.trim() || null,
      });
      toast.success("Kart güncellendi.");
      onOpenChange(false);
    } catch {
      toast.error("Kart güncellenemedi.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Bu kartı silmek istediğinize emin misiniz?")) return;

    try {
      await deleteCard(card.id, boardId);
      toast.success("Kart silindi.");
      onOpenChange(false);
    } catch {
      toast.error("Kart silinemedi.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-white/10 bg-slate-900 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <FileText className="h-5 w-5 text-indigo-400" />
            Kart Düzenle
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <label
              htmlFor="card-title"
              className="mb-1.5 block text-sm font-medium text-slate-300"
            >
              Başlık
            </label>
            <Input
              id="card-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="card-description"
              className="mb-1.5 block text-sm font-medium text-slate-300"
            >
              Açıklama
            </label>
            <Textarea
              id="card-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Kart açıklaması ekleyin..."
              rows={4}
              className="resize-none border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Sil
          </Button>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-slate-400 hover:text-white"
            >
              İptal
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading || !title.trim()}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500"
            >
              {loading ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
