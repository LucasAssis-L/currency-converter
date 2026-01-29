export const formatNumber = (
  value: number,
  maxDecimals = 2
) => {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxDecimals
  }).format(value);
};

export const parseNumber = (value: string): number => {
  return Number(
    value
      .replace(/\./g, "")
      .replace(",", ".")
  );
};