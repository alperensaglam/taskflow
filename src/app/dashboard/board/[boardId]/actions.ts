"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { generateKeyBetween } from "@/lib/fractional-index";

// ─── Column Actions ──────────────────────────────────────────

export async function createColumn(boardId: string, title: string) {
  const supabase = await createClient();

  if (!title?.trim()) throw new Error("Title is required");

  // Get the last column's position to append after it
  const { data: lastColumn } = await supabase
    .from("columns")
    .select("position")
    .eq("board_id", boardId)
    .order("position", { ascending: false })
    .limit(1)
    .single();

  const position = generateKeyBetween(lastColumn?.position ?? null, null);

  const { error } = await supabase.from("columns").insert({
    board_id: boardId,
    title: title.trim(),
    position,
  });

  if (error) throw new Error(error.message);

  revalidatePath(`/dashboard/board/${boardId}`);
}

export async function updateColumn(
  columnId: string,
  boardId: string,
  title: string
) {
  const supabase = await createClient();

  if (!title?.trim()) throw new Error("Title is required");

  const { error } = await supabase
    .from("columns")
    .update({ title: title.trim() })
    .eq("id", columnId);

  if (error) throw new Error(error.message);

  revalidatePath(`/dashboard/board/${boardId}`);
}

export async function deleteColumn(columnId: string, boardId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("columns")
    .delete()
    .eq("id", columnId);

  if (error) throw new Error(error.message);

  revalidatePath(`/dashboard/board/${boardId}`);
}

// ─── Card Actions ────────────────────────────────────────────

export async function createCard(
  columnId: string,
  boardId: string,
  title: string
) {
  const supabase = await createClient();

  if (!title?.trim()) throw new Error("Title is required");

  // Get the last card's position in this column
  const { data: lastCard } = await supabase
    .from("cards")
    .select("position")
    .eq("column_id", columnId)
    .order("position", { ascending: false })
    .limit(1)
    .single();

  const position = generateKeyBetween(lastCard?.position ?? null, null);

  const { error } = await supabase.from("cards").insert({
    column_id: columnId,
    title: title.trim(),
    position,
  });

  if (error) throw new Error(error.message);

  revalidatePath(`/dashboard/board/${boardId}`);
}

export async function updateCard(
  cardId: string,
  boardId: string,
  data: { title?: string; description?: string | null }
) {
  const supabase = await createClient();

  const updateData: Record<string, string | null> = {};
  if (data.title !== undefined) {
    if (!data.title?.trim()) throw new Error("Title is required");
    updateData.title = data.title.trim();
  }
  if (data.description !== undefined) {
    updateData.description = data.description;
  }

  const { error } = await supabase
    .from("cards")
    .update(updateData)
    .eq("id", cardId);

  if (error) throw new Error(error.message);

  revalidatePath(`/dashboard/board/${boardId}`);
}

export async function deleteCard(cardId: string, boardId: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("cards").delete().eq("id", cardId);

  if (error) throw new Error(error.message);

  revalidatePath(`/dashboard/board/${boardId}`);
}

export async function moveCard(
  cardId: string,
  boardId: string,
  targetColumnId: string,
  newPosition: string
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("cards")
    .update({
      column_id: targetColumnId,
      position: newPosition,
    })
    .eq("id", cardId);

  if (error) throw new Error(error.message);

  revalidatePath(`/dashboard/board/${boardId}`);
}
