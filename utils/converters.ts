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