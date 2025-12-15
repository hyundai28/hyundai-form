// -----------------------------------------------------------
// FORMATADOR DE MOEDA
// -----------------------------------------------------------
export default function formatCurrency(value: string) {
  const clean = value.replace(/\D/g, "");
  const num = Number(clean) / 100;

  if (isNaN(num)) return "";
  return num.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function convertToFloat(value: string | undefined): number {
  if (!value) {
    return 0;
  }

  let cleanedValue = value.replace(/[^0-9,.]/g, "");

  if (cleanedValue.includes(",")) {
    cleanedValue = cleanedValue.replace(/\./g, "");

    cleanedValue = cleanedValue.replace(",", ".");
  }

  const floatValue = parseFloat(cleanedValue);

  return isNaN(floatValue) ? 0 : floatValue;
}
