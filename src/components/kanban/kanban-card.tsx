"use client";

import { useState } from "react";
import type {
  DraggableProvided,
  DraggableStateSnapshot,
} from "@hello-pangea/dnd";
import { Card as CardType } from "@/lib/types";
import { EditCardDialog } from "./edit-card-dialog";
import { GripVertical, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface KanbanCardProps {
  card: CardType;
  boardId: string;
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
  isOtherDragging: boolean;
}

export function KanbanCard({
  card,
  boardId,
  provided,
  snapshot,
  isOtherDragging,
}: KanbanCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const isDragging = snapshot.isDragging;

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════
          OUTER WRAPPER — Positioning only. Controlled by the library.
          NEVER add transitions, transforms, or visual styles here.
          The library sets position:fixed + transform:translate() on
          this element during drag. Any interference causes offset.
          ═══════════════════════════════════════════════════════════ */}
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        onClick={() => {
          if (!isDragging) setEditOpen(true);
        }}
        style={provided.draggableProps.style}
        className="!outline-none"
      >
        {/* ═══════════════════════════════════════════════════════
            INNER WRAPPER — All visual effects go here.
            Rotate, scale, shadow, etc. on this inner div do NOT
            affect the library's positioning math on the outer div.
            ═══════════════════════════════════════════════════════ */}
        <div
          className={cn(
            // ── Base card surface ──
            "group relative cursor-grab select-none",
            "rounded-xl border border-white/[0.08] bg-slate-800/70 p-3",
            // Smooth transitions for visual props only (NOT transform on outer)
            "transition-[box-shadow,border-color,opacity,background-color,scale,rotate] duration-200 ease-out",
            // Hover
            "hover:border-white/[0.15] hover:bg-slate-800/90",
            "hover:shadow-lg hover:shadow-black/20",
            "active:cursor-grabbing",

            // ══════════════════════════════════════════════════
            // DRAGGING — Card lifts off the board
            // ══════════════════════════════════════════════════
            isDragging && [
              "!cursor-grabbing",
              // Physical lift: rotate + scale on the INNER div only
              "rotate-[2deg] scale-[1.03]",
              // Vivid border + glow ring
              "!border-indigo-400/50",
              "ring-2 ring-indigo-500/25",
              // Solid opaque background
              "!bg-slate-800",
              // Deep layered shadow — the premium "float" effect
              "shadow-[0_25px_50px_-12px_rgba(99,102,241,0.4),0_0_15px_rgba(99,102,241,0.1)]",
              "opacity-[0.97]",
            ],

            // ══════════════════════════════════════════════════
            // OTHER CARDS DIM — Focus on the active card
            // ══════════════════════════════════════════════════
            isOtherDragging && [
              "opacity-50",
              "pointer-events-none",
            ],

            // ══════════════════════════════════════════════════
            // DROP SETTLING — Brief glow as card snaps into place
            // ══════════════════════════════════════════════════
            snapshot.isDropAnimating && [
              "!rotate-0 !scale-100",
              "shadow-lg shadow-indigo-500/10",
              "ring-1 ring-indigo-500/20",
            ]
          )}
        >
          <div className="flex items-start gap-2">
            {/* Drag handle grip */}
            <div
              className={cn(
                "mt-0.5 flex-shrink-0 transition-opacity duration-150",
                isDragging
                  ? "opacity-80"
                  : "opacity-0 group-hover:opacity-50",
                // Always visible on mobile (no hover)
                "max-sm:!opacity-40"
              )}
            >
              <GripVertical className="h-4 w-4 text-slate-400" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium leading-snug text-slate-200">
                {card.title}
              </p>
              {card.description && (
                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
                  <FileText className="h-3 w-3 flex-shrink-0" />
                  <span>Açıklama mevcut</span>
                </div>
              )}
            </div>
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
