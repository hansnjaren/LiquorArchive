export function updateDrinkList(
  drinks: {
    bottleId: string;
    count: string;
    search: string;
    dropdownOpen: boolean;
  }[],
  idx: number,
  key: "bottleId" | "count" | "search" | "dropdownOpen",
  value: string | boolean
) {
  const next = [...drinks];
  next[idx] = { ...next[idx], [key]: value };

  if (
    next.length < 10 &&
    next[next.length - 1].bottleId &&
    next[next.length - 1].count
  ) {
    next.push({ bottleId: "", count: "", search: "", dropdownOpen: false });
  }

  while (
    next.length > 1 &&
    !next[next.length - 1].bottleId &&
    !next[next.length - 1].count &&
    !next[next.length - 2].bottleId &&
    !next[next.length - 2].count
  ) {
    next.pop();
  }

  return next;
}
