/**
 * Helpers for serializing/deserializing array fields stored as JSON strings in SQLite.
 * SQLite doesn't support Json or String[] types in Prisma, so we store arrays as
 * JSON-encoded strings and convert them back on read.
 */

export function arrToStr(arr: string[] | undefined | null): string | null {
  if (!arr || arr.length === 0) return null;
  return JSON.stringify(arr);
}

export function objToStr(obj: any): string | null {
  if (obj === null || obj === undefined) return null;
  return JSON.stringify(obj);
}

export function strToArr(str: string | null | undefined): string[] {
  if (!str) return [];
  try {
    const parsed = JSON.parse(str);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function strToObj<T = any>(str: string | null | undefined): T | null {
  if (!str) return null;
  try {
    return JSON.parse(str) as T;
  } catch {
    return null;
  }
}
