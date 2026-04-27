export interface Board {
  id: string;
  title: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Column {
  id: string;
  board_id: string;
  title: string;
  position: string; // Fractional index for ordering
  created_at: string;
  updated_at: string;
}

export interface Card {
  id: string;
  column_id: string;
  title: string;
  description: string | null;
  position: string; // Fractional index for ordering
  created_at: string;
  updated_at: string;
}

// Extended types for UI state
export interface ColumnWithCards extends Column {
  cards: Card[];
}

export interface BoardWithColumnsAndCards extends Board {
  columns: ColumnWithCards[];
}
