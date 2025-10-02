export const getInitialsWithSurname = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 0) return "";

  const surname = parts[0];
  const initials = parts
    .slice(1)
    .map((name) => name[0].toUpperCase())
    .join(".");

  return initials ? `${surname} ${initials}.` : surname;
};
