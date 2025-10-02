export type SortDirection = "asc" | "desc" | null;

interface SortableItem {
  [key: string]: string | number | boolean | null | undefined;
}

export const sortTableData = <T extends SortableItem>(
  data: T[],
  sortField: string | null,
  sortDirection: SortDirection,
): T[] => {
  if (!sortField || !sortDirection || data.length === 0) {
    return data;
  }

  return [...data].sort((a, b) => {
    const valueA = a[sortField];
    const valueB = b[sortField];

    if (valueA == null && valueB == null) return 0;
    if (valueA == null) return sortDirection === "asc" ? 1 : -1;
    if (valueB == null) return sortDirection === "asc" ? -1 : 1;

    if (typeof valueA === "number" && typeof valueB === "number") {
      return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
    }

    if (typeof valueA === "string" && typeof valueB === "string") {
      return sortDirection === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    const strA = String(valueA);
    const strB = String(valueB);
    return sortDirection === "asc"
      ? strA.localeCompare(strB)
      : strB.localeCompare(strA);
  });
};
