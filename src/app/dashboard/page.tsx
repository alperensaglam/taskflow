import { createClient } from "@/lib/supabase/server";
import { BoardCard } from "@/components/dashboard/board-card";
import { CreateBoardDialog } from "@/components/dashboard/create-board-dialog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — TaskFlow",
  description: "Board'larınızı yönetin ve yeni projeler oluşturun.",
};

export default async function DashboardPage() {
  const supabase = await createClient();

  // Fetch boards with column and card counts
  const { data: boards } = await supabase
    .from("boards")
    .select("*")
    .order("created_at", { ascending: false });

  // Get column and card counts for each board
  const boardsWithCounts = await Promise.all(
    (boards || []).map(async (board) => {
      const { data: columns } = await supabase
        .from("columns")
        .select("id")
        .eq("board_id", board.id);

      let cardCount = 0;
      if (columns && columns.length > 0) {
        const columnIds = columns.map((c) => c.id);
        const { count } = await supabase
          .from("cards")
          .select("*", { count: "exact", head: true })
          .in("column_id", columnIds);
        cardCount = count || 0;
      }

      return {
        board,
        columnCount: columns?.length || 0,
        cardCount,
      };
    })
  );

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Board&apos;larım
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Projelerinizi organize edin ve görevlerinizi takip edin.
        </p>
      </div>

      {/* Board Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {boardsWithCounts.map(({ board, columnCount, cardCount }, index) => (
          <BoardCard
            key={board.id}
            board={board}
            index={index}
            columnCount={columnCount}
            cardCount={cardCount}
          />
        ))}
        <CreateBoardDialog />
      </div>

      {/* Empty State */}
      {boardsWithCounts.length === 0 && (
        <div className="mt-8 text-center">
          <p className="text-lg text-slate-400">
            Henüz bir board&apos;unuz yok.
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Yukarıdaki &quot;Yeni Board Oluştur&quot; butonuna tıklayarak
            başlayın.
          </p>
        </div>
      )}
    </div>
  );
}
