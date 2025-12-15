"use server";

import { auth } from "@clerk/nextjs/server";
import { FormSchemaType } from "@/types/form_types";
import { supabase_server } from "@/lib/supabase_server";

interface DashboardFilters {
  startDate?: string;
  endDate?: string;
}

export type NotaFiscalDashboardItem = Omit<
  FormSchemaType,
  "pecas" | "desconto" | "observacao"
> & {
  id: string;
  valor_nf_float: number;
};

export interface DashboardData {
  items: NotaFiscalDashboardItem[];
  totalValue: number;
  averageValue: number;
  count: number;
}

export async function fetchDashboardData(
  filters: DashboardFilters
): Promise<DashboardData | { error: string }> {
  // 1. Autenticação e Supabase
  const { userId } = await auth();
  if (!userId) {
    return { error: "Usuário não autenticado." };
  }

  // 2. Query e Filtros
  let query = supabase_server
    .from("notas_fiscais")
    // Selecionamos todos os campos necessários para exibição e cálculo
    .select(
      `
        id, 
        ordem_servico, 
        numero_nf, 
        data_nf, 
        valor_nf, 
        tipo_de_venda,
        num_os_franquia,
        valor_franquia,
        num_nf_franquia
    `
    )
    .order("data_nf", { ascending: false });

  // Aplica Filtros de Data (se existirem)
  if (filters.startDate) {
    query = query.gte("data_nf", filters.startDate);
  }
  if (filters.endDate) {
    query = query.lte("data_nf", filters.endDate);
  }

  const { data: items, error } = await query;

  if (error) {
    console.error("Erro ao buscar dados do dashboard:", error);
    return { error: `Erro ao buscar dados: ${error.message}` };
  }

  // 3. Mapeamento e Transformação: Converte snake_case para camelCase e trata valores
  const transformedItems: NotaFiscalDashboardItem[] = items.map((item) => ({
    id: item.id,
    // Mapeamento DB (snake_case) para Zod (camelCase)
    ordemServico: item.ordem_servico,
    numeroNF: item.numero_nf,
    dataNF: item.data_nf,
    valorNF: item.valor_nf
      ? item.valor_nf.toFixed(2).replace(".", ",")
      : "0,00", // Formata como string de moeda para exibição
    tipoDeVenda: item.tipo_de_venda,
    numOSFranquia: item.num_os_franquia,
    valorFranquia: item.valor_franquia
      ? item.valor_franquia.toFixed(2).replace(".", ",")
      : undefined,
    numNFFranquia: item.num_nf_franquia,

    // Valor float mantido para cálculos de agregação
    valor_nf_float: item.valor_nf || 0,
  }));

  // 4. Cálculos de Agregação
  let totalValue = 0;

  if (transformedItems && transformedItems.length > 0) {
    // Soma todos os valores usando o float original
    totalValue = transformedItems.reduce(
      (sum, item) => sum + item.valor_nf_float,
      0
    );
  }

  const count = transformedItems.length;
  const averageValue = count > 0 ? totalValue / count : 0;

  return {
    items: transformedItems,
    totalValue,
    averageValue,
    count,
  };
}
