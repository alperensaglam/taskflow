"use client";

import { useState, useEffect, useCallback } from "react";
import {
  DragDropContext,
  type DropResult,
  type DragStart,
} from "@hello-pangea/dnd";
import { BoardWithColumnsAndCards, ColumnWithCards } from "@/lib/types";
import { KanbanColumn } from "./kanban-column";
import { AddColumnForm } from "./add-column-form";
import { generateKeyBetween } from "@/lib/fractional-index";
import { moveCard } from "@/app/dashboard/board/[boardId]/actions";
import { toast } from "sonner";

interface KanbanBoardProps {
  board: BoardWithColumnsAndCards;
}

export function KanbanBoard({ board }: KanbanBoardProps) {
  const [columns, setColumns] = useState<ColumnWithCards[]>(board.columns);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  // Sync local state with server data after revalidation
  // (e.g., after adding/deleting columns or cards via server actions)
  useEffect(() => {
    setColumns(board.columns);
  }, [board.columns]);

  const handleDragStart = useCallback((start: DragStart) => {
    setActiveCardId(start.draggableId);
    // Add body class to prevent text selection during drag
    document.body.classList.add("is-dragging");
  }, []);

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      setActiveCardId(null);
      document.body.classList.remove("is-dragging");

      const { source, destination, draggableId } = result;

      // Dropped outside any droppable
      if (!destination) return;

      // Dropped in the exact same position
      if (
        source.droppableId === destination.droppableId &&
        source.index === destination.index
      ) {
        return;
      }

      const sourceColId = source.droppableId;
      const destColId = destination.droppableId;

      // Find source and destination columns
      const sourceCol = columns.find((c) => c.id === sourceColId);
      const destCol = columns.find((c) => c.id === destColId);
      if (!sourceCol || !destCol) return;

      // Find the card being moved
      const movedCard = sourceCol.cards[source.index];
      if (!movedCard || movedCard.id !== draggableId) return;

      // ──────────────────────────────────────────────────────
      // Compute the destination cards (WITHOUT the moved card)
      // to find the correct neighbors for fractional indexing
      // ──────────────────────────────────────────────────────
      let destCards;
      if (sourceColId === destColId) {
        // Same column reorder: remove the card first
        destCards = sourceCol.cards.filter((_, i) => i !== source.index);
      } else {
        // Cross-column move: destination has its original cards
        destCards = [...destCol.cards];
      }

      // Get adjacent cards at the target position
      const prevCard =
        destination.index > 0 ? destCards[destination.index - 1] : null;
      const nextCard =
        destination.index < destCards.length
          ? destCards[destination.index]
          : null;

      // Compute new position using fractional indexing
      // This only updates ONE card's position — no mass re-indexing
      const newPosition = generateKeyBetween(
        prevCard?.position ?? null,
        nextCard?.position ?? null
      );

      // ──────────────────────────────────────────────────────
      // Optimistic Update: modify local state immediately
      // ──────────────────────────────────────────────────────
      const prevColumns = columns; // Snapshot for rollback

      const updatedCard = {
        ...movedCard,
        column_id: destColId,
        position: newPosition,
      };

      const newColumns = columns.map((col) => {
        if (sourceColId === destColId && col.id === sourceColId) {
          // Same-column reorder
          const newCards = [...col.cards];
          newCards.splice(source.index, 1);
          newCards.splice(destination.index, 0, updatedCard);
          return { ...col, cards: newCards };
        }

        if (col.id === sourceColId) {
          // Remove from source column
          return {
            ...col,
            cards: col.cards.filter((_, i) => i !== source.index),
          };
        }

        if (col.id === destColId) {
          // Insert into destination column
          const newCards = [...col.cards];
          newCards.splice(destination.index, 0, updatedCard);
          return { ...col, cards: newCards };
        }

        return col;
      });

      setColumns(newColumns);

      // ──────────────────────────────────────────────────────
      // Background DB Sync: persist to Supabase
      // Revert optimistic state on failure
      // ──────────────────────────────────────────────────────
      moveCard(movedCard.id, board.id, destColId, newPosition).catch(() => {
        setColumns(prevColumns);
        toast.error("Kart taşınamadı. Değişiklik geri alındı.");
      });
    },
    [columns, board.id]
  );

  return (
    <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex h-full gap-4 overflow-x-auto p-4 pb-8 sm:p-6">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            boardId={board.id}
            activeCardId={activeCardId}
          />
        ))}
        <AddColumnForm boardId={board.id} />
      </div>
    </DragDropContext>
  );
}
