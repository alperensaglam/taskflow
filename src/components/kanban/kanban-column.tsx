"use client";

import { useState } from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import {
  updateColumn,
  deleteColumn,
} from "@/app/dashboard/board/[boardId]/actions";
import { ColumnWithCards } from "@/lib/types";
import { KanbanCard } from "./kanban-card";
import { AddCardForm } from "./add-card-form";
import { MoreHorizontal, Trash2, Pencil } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface KanbanColumnProps {
  column: ColumnWithCards;
  boardId: string;
  activeCardId: string | null;
}

export function KanbanColumn({
  column,
  boardId,
  activeCardId,
}: KanbanColumnProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(column.title);

  async function handleTitleSave() {
    if (!title.trim() || title.trim() === column.title) {
      setTitle(column.title);
      setIsEditing(false);
      return;
    }

    try {
      await updateColumn(column.id, boardId, title);
      toast.success("Sütun güncellendi.");
    } catch {
      toast.error("Sütun güncellenemedi.");
      setTitle(column.title);
    }
    setIsEditing(false);
  }

  async function handleDelete() {
    if (
      column.cards.length > 0 &&
      !confirm(
        `Bu sütun ${column.cards.length} kart içeriyor. Silmek istediğinize emin misiniz?`
      )
    ) {
      return;
    }

    try {
      await deleteColumn(column.id, boardId);
      toast.success("Sütun silindi.");
    } catch {
      toast.error("Sütun silinemedi.");
    }
  }

  // Keep title in sync with prop changes (from server revalidation)
  if (!isEditing && title !== column.title) {
    setTitle(column.title);
  }

  return (
    <div className="flex w-[300px] flex-shrink-0 flex-col rounded-2xl border border-white/[0.06] bg-slate-900/50 backdrop-blur-sm sm:w-[320px]">
      {/* Column Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {isEditing ? (
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleTitleSave();
                if (e.key === "Escape") {
                  setTitle(column.title);
                  setIsEditing(false);
                }
              }}
              className="w-full rounded-md border border-indigo-500/30 bg-white/5 px-2 py-1 text-sm font-semibold text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
            />
          ) : (
            <>
              <h3 className="truncate text-sm font-semibold text-slate-200">
                {column.title}
              </h3>
              <span className="flex h-5 min-w-[20px] flex-shrink-0 items-center justify-center rounded-full bg-white/5 px-1.5 text-xs font-medium text-slate-400">
                {column.cards.length}
              </span>
            </>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="ml-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-white/5 hover:text-slate-300">
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="border-white/10 bg-slate-900"
          >
            <DropdownMenuItem
              className="flex cursor-pointer items-center gap-2 text-slate-300"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="h-4 w-4" />
              Yeniden Adlandır
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex cursor-pointer items-center gap-2 text-red-400 focus:text-red-300"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
              Sütunu Sil
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Droppable Cards Area */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              "flex min-h-[60px] flex-1 flex-col gap-2 px-3 pb-2 transition-colors duration-200",
              snapshot.isDraggingOver &&
                "rounded-xl bg-indigo-500/[0.04] ring-1 ring-inset ring-indigo-500/10"
            )}
          >
            {column.cards.map((card, index) => (
              <Draggable key={card.id} draggableId={card.id} index={index}>
                {(dragProvided, dragSnapshot) => (
                  <KanbanCard
                    card={card}
                    boardId={boardId}
                    provided={dragProvided}
                    isDragging={dragSnapshot.isDragging}
                    isOtherDragging={
                      activeCardId !== null && activeCardId !== card.id
                    }
                  />
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* Add Card */}
      <div className="border-t border-white/[0.04] px-3 py-2">
        <AddCardForm columnId={column.id} boardId={boardId} />
      </div>
    </div>
  );
}
