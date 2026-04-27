"use client";

import { deleteBoard } from "@/app/dashboard/actions";
import { Board } from "@/lib/types";
import Link from "next/link";
import { MoreHorizontal, Trash2, ArrowRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

// Vibrant gradient palette for board cards
const GRADIENTS = [
  "from-indigo-600/20 to-purple-600/20",
  "from-emerald-600/20 to-teal-600/20",
  "from-rose-600/20 to-pink-600/20",
  "from-amber-600/20 to-orange-600/20",
  "from-cyan-600/20 to-blue-600/20",
  "from-fuchsia-600/20 to-violet-600/20",
];

const BORDER_COLORS = [
  "hover:border-indigo-500/30",
  "hover:border-emerald-500/30",
  "hover:border-rose-500/30",
  "hover:border-amber-500/30",
  "hover:border-cyan-500/30",
  "hover:border-fuchsia-500/30",
];

const ICON_COLORS = [
  "text-indigo-400",
  "text-emerald-400",
  "text-rose-400",
  "text-amber-400",
  "text-cyan-400",
  "text-fuchsia-400",
];

interface BoardCardProps {
  board: Board;
  index: number;
  columnCount?: number;
  cardCount?: number;
}

export function BoardCard({
  board,
  index,
  columnCount = 0,
  cardCount = 0,
}: BoardCardProps) {
  const gradientIdx = index % GRADIENTS.length;

  async function handleDelete() {
    if (!confirm("Bu board'u silmek istediğinize emin misiniz?")) return;

    try {
      await deleteBoard(board.id);
      toast.success("Board silindi.");
    } catch {
      toast.error("Board silinemedi.");
    }
  }

  return (
    <div className="group relative">
      <Link href={`/dashboard/board/${board.id}`} className="block">
        <div
          className={`relative h-48 rounded-2xl border border-white/10 bg-gradient-to-br ${GRADIENTS[gradientIdx]} ${BORDER_COLORS[gradientIdx]} p-5 transition-all duration-300 hover:shadow-lg hover:shadow-black/20`}
        >
          {/* Content */}
          <div className="flex h-full flex-col justify-between">
            <div className="pr-8">
              <h3 className="text-lg font-semibold text-white">
                {board.title}
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                {columnCount} sütun · {cardCount} kart
              </p>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {new Date(board.created_at).toLocaleDateString("tr-TR", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full bg-white/5 transition-transform group-hover:translate-x-0.5 ${ICON_COLORS[gradientIdx]}`}
              >
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Menu - positioned absolute over the card */}
      <div className="absolute right-3 top-3 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex h-8 w-8 items-center justify-center rounded-lg opacity-0 transition-opacity hover:bg-white/10 group-hover:opacity-100"
          >
            <MoreHorizontal className="h-4 w-4 text-slate-400" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="border-white/10 bg-slate-900"
          >
            <DropdownMenuItem
              className="flex cursor-pointer items-center gap-2 text-red-400 focus:text-red-300"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
              Board&apos;u Sil
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
