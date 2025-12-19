"use client";
import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { fetchDashboardData } from "@/actions/fetchNotasFiscais";
import { DashboardData } from "@/types/notas_banco_schema";
import { MetricsCards } from "@/components/relatorio/MetricsCards";
import { DateFilters } from "@/components/relatorio/DateFilters";
import { ExportButton } from "@/components/relatorio/ExportButton";
import { InvoiceTable } from "@/components/relatorio/InvoiceTable";

const initialData: DashboardData = {
  items: [],
  totalValue: 0,
  averageValue: 0,
  count: 0,
};

const getMonthBounds = () => {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .split("T")[0];
  const today = now.toISOString().split("T")[0];
  return { firstDay, today };
};

export default function DashboardPage() {
  const { firstDay, today } = getMonthBounds();
  const [data, setData] = useState<DashboardData>(initialData);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(firstDay);
  const [endDate, setEndDate] = useState(today);
  const [globalFilter, setGlobalFilter] = useState(""); // Novo state para filtro

  // Filtra os itens com base no globalFilter (por dealerCode, case-insensitive)
  const filteredItems = data.items.filter((item) =>
    item.dealerCode.toLowerCase().includes(globalFilter.toLowerCase())
  );

  // Atualiza count baseado nos filtrados (opcional, mas mantém consistência nos cards/export)
  const filteredCount = filteredItems.length;

  useEffect(() => {
    let cancelled = false;
    const loadData = async () => {
      setLoading(true);
      const result = await fetchDashboardData({ startDate, endDate });
      if (cancelled) return;
      if ("error" in result) {
        console.error(result.error);
      } else {
        setData(result);
      }
      setLoading(false);
    };
    loadData();
    return () => {
      cancelled = true;
    };
  }, [startDate, endDate]);

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Painel de Acompanhamento NF</h1>
      <MetricsCards data={data} loading={loading} />{" "}
      {/* Cards ainda usam data total; se quiser filtrados, ajuste */}
      <Separator />
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <DateFilters
          startDate={startDate}
          endDate={endDate}
          onStartChange={setStartDate}
          onEndChange={setEndDate}
        />
        <ExportButton
          data={{ ...data, items: filteredItems, count: filteredCount }} // Passa data com itens filtrados
          startDate={startDate}
          endDate={endDate}
          loading={loading}
        />
      </div>
      <Separator />
      <h2 className="text-2xl font-semibold">Detalhes das Notas Fiscais</h2>
      <InvoiceTable
        data={{ ...data, items: filteredItems, count: filteredCount }} // Passa itens filtrados para a table
        loading={loading}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter} // Passa o filtro para o componente gerenciar o input
      />
    </div>
  );
}
