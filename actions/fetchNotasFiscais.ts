"use server";

import { auth } from "@clerk/nextjs/server";
import { supabase_server } from "@/lib/supabase_server";

/* ======================================================
   TIPOS
====================================================== */

/** Filtros do dashboard */
interface DashboardFilters {
  startDate?: string;
  endDate?: string;
}

/** Representa exatamente a tabela do Supabase (snake_case) */
interface NotaFiscalDB {
  id: string;

  ordem_servico: string;
  numero_nf: string;
  data_nf: string;

  valor_nf: number;

  tipo_de_venda: string;

  num_os_franquia: string | null;
  num_nf_franquia: string | null;
  valor_franquia: number | null;

  dealer_code: string;
}

/** Item já transformado para o frontend (camelCase) */
export interface NotaFiscalDashboardItem {
  id: string;

  ordemServico: string;
  numeroNF: string;
  dataNF: string;

  tipoDeVenda: string;

  valorNF: string;        // exibição: "1.234,56"
  valorNFFloat: number;   // cálculo

  numOSFranquia?: string;
  numNFFranquia?: string;
  valorFranquia?: string;

  dealerCode: string;
}

/** Retorno final do dashboard */
export interface DashboardData {
  items: NotaFiscalDashboardItem[];
  totalValue: number;
  averageValue: number;
  count: number;
}

/* ======================================================
   ACTION
====================================================== */

export async function fetchDashboardData(
  filters: DashboardFilters
): Promise<DashboardData | { error: string }> {
  /* ---------- 1. Autenticação ---------- */
  const { userId } = await auth();

  if (!userId) {
    return { error: "Usuário não autenticado." };
  }

  /* ---------- 2. Query ---------- */
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
        dealer_code
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
