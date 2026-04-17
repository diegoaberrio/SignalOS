export const normalizeText = (value = "") => {
  return String(value)
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
};

export const normalizeCompanyName = (companyName = "") => {
  return normalizeText(companyName)
    .replace(/[^\w\s&.-]/g, "")
    .trim();
};