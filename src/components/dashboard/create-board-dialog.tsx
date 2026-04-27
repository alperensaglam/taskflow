"use client";

import { useState } from "react";
import { createBoard } from "@/app/dashboard/actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export function CreateBoardDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      await createBoard(formData);
      toast.success("Board oluşturuldu!");
      setOpen(false);
    } catch {
      toast.error("Board oluşturulamadı.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className="group flex h-48 w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-white/10 bg-white/[0.02] transition-all hover:border-indigo-500/40 hover:bg-indigo-500/5"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 transition-colors group-hover:bg-indigo-500/10">
          <Plus className="h-6 w-6 text-slate-500 transition-colors group-hover:text-indigo-400" />
        </div>
        <span className="text-sm font-medium text-slate-500 transition-colors group-hover:text-indigo-400">
          Yeni Board Oluştur
        </span>
      </DialogTrigger>
      <DialogContent className="border-white/10 bg-slate-900 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Yeni Board</DialogTitle>
          <DialogDescription className="text-slate-400">
            Projelerinizi organize etmek için yeni bir board oluşturun.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit}>
          <div className="py-4">
            <Input
              id="title"
              name="title"
              placeholder="Board adı..."
              required
              autoFocus
              className="border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus:border-indigo-500"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              İptal
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500"
            >
              {loading ? "Oluşturuluyor..." : "Oluştur"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
