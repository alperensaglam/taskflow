/**
 * Fractional Indexing Utility
 *
 * Generates lexicographically ordered strings that can be inserted between
 * any two existing strings without needing to re-index other items.
 *
 * This is critical for the Kanban board: when a card is dragged between
 * two others, we only update ONE row in Supabase (the moved card),
 * instead of re-numbering every card in the column.
 *
 * Algorithm:
 * - Uses base-95 printable ASCII characters (space=32 to tilde=126)
 * - generateKeyBetween(a, b) returns a string that sorts between a and b
 * - For first item: generateKeyBetween(null, null) → "a"
 * - For appending: generateKeyBetween(lastKey, null) → something after lastKey
 * - For prepending: generateKeyBetween(null, firstKey) → something before firstKey
 */

const SMALLEST_CHAR = " "; // ASCII 32
const LARGEST_CHAR = "~"; // ASCII 126
const MID_CHAR = "a"; // A good default midpoint

/**
 * Generate a key that sorts between `a` and `b`.
 * - If both are null, returns the midpoint.
 * - If `a` is null, returns something before `b`.
 * - If `b` is null, returns something after `a`.
 */
export function generateKeyBetween(
  a: string | null,
  b: string | null
): string {
  // Case 1: Both null — return midpoint
  if (a === null && b === null) {
    return MID_CHAR;
  }

  // Case 2: Only inserting before b
  if (a === null) {
    return midpoint("", b!);
  }

  // Case 3: Only inserting after a
  if (b === null) {
    return incrementKey(a);
  }

  // Case 4: Insert between a and b
  if (a >= b) {
    throw new Error(
      `generateKeyBetween: a must be less than b (a=${a}, b=${b})`
    );
  }

  return midpoint(a, b);
}

/**
 * Generate N keys between a and b, evenly distributed.
 */
export function generateNKeysBetween(
  a: string | null,
  b: string | null,
  n: number
): string[] {
  if (n === 0) return [];
  if (n === 1) return [generateKeyBetween(a, b)];

  const keys: string[] = [];
  let prev = a;

  for (let i = 0; i < n; i++) {
    // For each iteration, compute the remaining fraction
    const key = generateKeyBetween(prev, b);
    keys.push(key);
    prev = key;
  }

  return keys;
}

/**
 * Find a string that sorts between `a` and `b` lexicographically.
 */
function midpoint(a: string, b: string): string {
  // Pad `a` to the same length as `b` with SMALLEST_CHAR
  const paddedA = a.padEnd(b.length, SMALLEST_CHAR);

  // Walk through characters to find where they differ
  let prefix = "";
  for (let i = 0; i < paddedA.length; i++) {
    const charA = paddedA.charCodeAt(i);
    const charB = b.charCodeAt(i);

    if (charA === charB) {
      prefix += paddedA[i];
      continue;
    }

    // Characters differ — compute midpoint
    const midChar = Math.round((charA + charB) / 2);

    if (midChar > charA) {
      return prefix + String.fromCharCode(midChar);
    }

    // midpoint rounded down to charA — need to go deeper
    prefix += paddedA[i];
    // Now find midpoint between rest of a and LARGEST_CHAR
    return prefix + midpointChar(paddedA.charCodeAt(i + 1) || 32, 126);
  }

  // If we get here, a is a prefix of b, so append a mid-char
  return a + MID_CHAR;
}

/**
 * Find a character between two char codes.
 */
function midpointChar(a: number, b: number): string {
  return String.fromCharCode(Math.round((a + b) / 2));
}

/**
 * Generate a key that sorts after `key` by incrementing the last character
 * or appending a new character.
 */
function incrementKey(key: string): string {
  const lastChar = key.charCodeAt(key.length - 1);

  if (lastChar < 126) {
    // Increment last character
    return key.slice(0, -1) + String.fromCharCode(lastChar + 1);
  }

  // Last char is already at max — append midpoint
  return key + MID_CHAR;
}
