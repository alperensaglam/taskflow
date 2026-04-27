"use client";

import { useState } from "react";
import type { DraggableProvided } from "@hello-pangea/dnd";
import { Card as CardType } from "@/lib/types";
import { EditCardDialog } from "./edit-card-dialog";
import { GripVertical, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface KanbanCardProps {
  card: CardType;
  boardId: string;
  provided: DraggableProvided;
  isDragging: boolean;
  isOtherDragging: boolean;
}

export function KanbanCard({
  card,
  boardId,
  provided,
  isDragging,
  isOtherDragging,
}: KanbanCardProps) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        onClick={() => {
          // Only open edit dialog if we're not in a drag
          if (!isDragging) {
            setEditOpen(true);
          }
        }}
        className={cn(
          // ── Base styles ──
          "group cursor-grab rounded-xl border border-white/[0.06] bg-slate-800/60 p-3 shadow-sm",
          "transition-[border-color,box-shadow,opacity] duration-200",
          "hover:border-indigo-500/20 hover:bg-slate-800/80 hover:shadow-md hover:shadow-black/10",
          "active:cursor-grabbing",

          // ── Dragging state: lifted card visual cues ──
          isDragging && [
            "!cursor-grabbing",
            "rotate-[2deg] scale-[1.03]",
            "border-indigo-500/30 bg-slate-800",
            "shadow-2xl shadow-indigo-500/20",
            "ring-1 ring-indigo-500/20",
            "opacity-95",
          ],

          // ── Other cards dim when something is being dragged ──
          isOtherDragging && "opacity-60"
        )}
        style={{
          ...provided.draggableProps.style,
          // Smooth snap animation when dropping
          transition: isDragging
            ? provided.draggableProps.style?.transition
            : `${provided.draggableProps.style?.transition || ""}, border-color 200ms, box-shadow 200ms, opacity 200ms`.replace(
                /^, /,
                ""
              ),
        }}
      >
        <div className="flex items-start gap-2">
          {/* Drag handle indicator */}
          <div
            className={cn(
              "mt-0.5 flex-shrink-0 transition-opacity",
              isDragging
                ? "opacity-70"
                : "opacity-0 group-hover:opacity-40 sm:opacity-0",
              // Always show on touch devices (no hover)
              "touch-none max-sm:opacity-30"
            )}
          >
            <GripVertical className="h-4 w-4 text-slate-500" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium leading-snug text-slate-200">
              {card.title}
            </p>
            {card.description && (
              <div className="mt-1.5 flex items-center gap-1 text-xs text-slate-500">
                <FileText className="h-3 w-3" />
                <span>Açıklama mevcut</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <EditCardDialog
        card={card}
        boardId={boardId}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  );
}
