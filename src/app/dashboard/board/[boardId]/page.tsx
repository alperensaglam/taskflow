import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { KanbanBoard } from "@/components/kanban/kanban-board";
import { BoardWithColumnsAndCards } from "@/lib/types";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

type PageProps = {
  params: Promise<{ boardId: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { boardId } = await params;
  const supabase = await createClient();
  const { data: board } = await supabase
    .from("boards")
    .select("title")
    .eq("id", boardId)
    .single();

  return {
    title: board ? `${board.title} — TaskFlow` : "Board — TaskFlow",
  };
}

export default async function BoardPage({ params }: PageProps) {
  const { boardId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch the board
  const { data: board } = await supabase
    .from("boards")
    .select("*")
    .eq("id", boardId)
    .single();

  if (!board) {
    notFound();
  }

  // Fetch columns with their cards, ordered by position
  const { data: columns } = await supabase
    .from("columns")
    .select("*")
    .eq("board_id", boardId)
    .order("position", { ascending: true });

  // Fetch cards for all columns
  const columnsWithCards = await Promise.all(
    (columns || []).map(async (column) => {
      const { data: cards } = await supabase
        .from("cards")
        .select("*")
        .eq("column_id", column.id)
        .order("position", { ascending: true });

      return {
        ...column,
        cards: cards || [],
      };
    })
  );

  const boardWithData: BoardWithColumnsAndCards = {
    ...board,
    columns: columnsWithCards,
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Board Header */}
      <div className="border-b border-white/[0.06] bg-slate-950/50 backdrop-blur-sm">
        <div className="flex items-center gap-4 px-6 py-4">
          <Link
            href="/dashboard"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white">{board.title}</h1>
            <p className="text-xs text-slate-400">
              {columnsWithCards.length} sütun ·{" "}
              {columnsWithCards.reduce((sum, col) => sum + col.cards.length, 0)}{" "}
              kart
            </p>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-hidden">
        <KanbanBoard board={boardWithData} />
      </div>
    </div>
  );
}
