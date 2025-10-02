interface FilterableItem {
  [key: string]: string | number | boolean | null | undefined;
}

export const filterTableData = <T extends FilterableItem>(
  data: T[],
  filters: { [key: string]: string | number | boolean | null | undefined },
): T[] => {
  return data.filter((item) =>
    Object.entries(filters).every(([key, filterValue]) => {
      if (typeof filterValue === "boolean") return true;
      if (!filterValue) return true;

      const itemValue = item[key];
      if (itemValue == null) return false;

      const filterStr = String(filterValue).toLowerCase();

      if (typeof itemValue === "number") {
        return itemValue.toString().includes(filterStr);
      }

      if (typeof itemValue === "string") {
        return itemValue.toLowerCase().includes(filterStr);
      }

      return false;
    }),
  );
};
