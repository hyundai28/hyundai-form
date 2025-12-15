"use server";

import { auth } from "@clerk/nextjs/server";
import { supabase_server } from "@/lib/supabase_server";
import {
  DashboardData,
  NotaFiscalDashboardItem,
  NotaFiscalDB,
} from "@/types/notas_banco_schema";

/** Filtros do dashboard */
interface DashboardFilters {
  startDate?: string;
  endDate?: string;
}

export async function fetchDashboardData(
  filters: DashboardFilters
): Promise<DashboardData | { error: string }> {
  /* ---------- 1. Autenticação ---------- */
  const { userId } = await auth();

  if (!userId) {
    return { error: "Usuário não autenticado." };
  }

  /* ---------- 2. Query com JOIN em nf_pecas ---------- */
  let query = supabase_server
    .from("notas_fiscais")
    .select(
      `
        id,
        ordem_servico,
        numero_nf,
        data_nf,
        valor_nf,
        tipo_de_venda,
        num_os_franquia,
        num_nf_franquia,
        valor_franquia,
        dealer_code,
        nf_pecas (
          id,
          codigo,
          valor
        )
      `
    )
    .order("data_nf", { ascending: false });

  if (filters.startDate) {
    query = query.gte("data_nf", filters.startDate);
  }

  if (filters.endDate) {
    query = query.lte("data_nf", filters.endDate);
  }

  const { data, error } = await query.returns<NotaFiscalDB[]>();

  if (error) {
    console.error("Erro ao buscar dados do dashboard:", error);
    return { error: error.message };
  }

  const itemsDB = data ?? [];

  /* ---------- 3. Transformação ---------- */
  const items: NotaFiscalDashboardItem[] = itemsDB.map((item) => ({
    id: item.id,

    ordemServico: item.ordem_servico,
    numeroNF: item.numero_nf,
    dataNF: item.data_nf,

    tipoDeVenda: item.tipo_de_venda,

    valorNF: item.valor_nf.toFixed(2).replace(".", ","),
    valorNFFloat: item.valor_nf,

    numOSFranquia: item.num_os_franquia ?? undefined,
    numNFFranquia: item.num_nf_franquia ?? undefined,
    valorFranquia: item.valor_franquia
      ? item.valor_franquia.toFixed(2).replace(".", ",")
      : undefined,

    dealerCode: item.dealer_code,

    // ✅ peças vindas da tabela nf_pecas
    pecas: (item.nf_pecas ?? []).map((peca) => ({
      id: peca.id,
      codigo: peca.codigo,
      valor: peca.valor.toFixed(2).replace(".", ","),
      valorFloat: peca.valor,
    })),
  }));

  /* ---------- 4. Agregações ---------- */
  const totalValue = items.reduce(
    (sum, item) => sum + item.valorNFFloat,
    0
  );

  const count = items.length;
  const averageValue = count > 0 ? totalValue / count : 0;

  /* ---------- 5. Retorno ---------- */
  return {
    items,
    totalValue,
    averageValue,
    count,
  };
}
