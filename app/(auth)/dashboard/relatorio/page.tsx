// src/app/dashboard/page.tsx

"use client";

import { useState, useEffect } from "react";
import { FileText, DollarSign, ListChecks, Download } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

import { fetchDashboardData, DashboardData } from "@/actions/fetchNotasFiscais";
import formatCurrency from "@/utils/converters";

// --- Configuração Inicial ---
const initialData: DashboardData = {
  items: [],
  totalValue: 0,
  averageValue: 0,
  count: 0,
};

const getMonthBounds = () => {
  const now = new Date();
  // Primeiro dia do mês atual
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .split("T")[0];
  // Dia de hoje
  const today = now.toISOString().split("T")[0];
  return { firstDay, today };
};

export default function DashboardPage() {
  const { firstDay, today } = getMonthBounds();
  const [data, setData] = useState<DashboardData>(initialData);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(firstDay);
  const [endDate, setEndDate] = useState(today);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      setLoading(true);

      const result = await fetchDashboardData({
        startDate,
        endDate,
      });

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

  // ----------------------------------------------------
  // Lógica de Exportação (CSV)
  // ----------------------------------------------------
  const exportToCSV = () => {
    if (data.items.length === 0) return;

    // Cabeçalho usa nomes de campos amigáveis
    const headers = [
      "ID",
      "Nº NF",
      "Nº OS",
      "Data",
      "Tipo Venda",
      "Valor NF (R$)",
      "Nº OS Franquia",
      "Nº NF Franquia",
      "Valor Franquia (R$)",
    ];

    const csvRows = data.items.map((item) =>
      [
        item.id,
        item.numeroNF,
        item.ordemServico,
        item.dataNF,
        item.tipoDeVenda,
        // Valor NF: Usa o valor formatado (ex: 1234,56)
        item.valorNF,
        item.numOSFranquia || "",
        item.numNFFranquia || "",
        item.valorFranquia || "0,00",
      ].join(";")
    );

    const csvContent = [headers.join(";"), ...csvRows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `relatorio_nf_${startDate}_a_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Painel de Acompanhamento NF</h1>

      {/* --- 1. CARDS SUPERIORES (Métricas) --- */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* CARD 1: Valor Total NF */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Valor Total de NF
            </CardTitle>
            <DollarSign className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading
                ? "R$ ..."
                : formatCurrency(data.totalValue.toFixed(2).replace(".", ","))}
            </div>
            <p className="text-xs text-slate-500">No período selecionado</p>
          </CardContent>
        </Card>

        {/* CARD 2: Total de Notas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Notas Fiscais
            </CardTitle>
            <FileText className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : data.count}
            </div>
            <p className="text-xs text-slate-500">Lançamentos realizados</p>
          </CardContent>
        </Card>

        {/* CARD 3: Valor Médio por NF */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Valor Médio por NF
            </CardTitle>
            <ListChecks className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading
                ? "R$ ..."
                : formatCurrency(
                    data.averageValue.toFixed(2).replace(".", ",")
                  )}
            </div>
            <p className="text-xs text-slate-500">Média de valor por nota</p>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* --- 2. FILTROS DE DATA E EXPORTAÇÃO --- */}
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full md:w-auto">
          <FormLabel>Data Inicial</FormLabel>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex-1 w-full md:w-auto">
          <FormLabel>Data Final</FormLabel>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full"
          />
        </div>
        <Button
          onClick={exportToCSV}
          disabled={data.count === 0 || loading}
          className="gap-2 bg-green-600 hover:bg-green-700 w-full md:w-auto"
        >
          <Download className="w-4 h-4" />
          Exportar CSV ({data.count} itens)
        </Button>
      </div>

      <Separator />

      {/* --- 3. TABELA DE RESULTADOS --- */}
      <h2 className="text-2xl font-semibold pt-4">
        Detalhes das Notas Fiscais
      </h2>

      {loading && <p className="text-center py-10">Carregando dados...</p>}

      {!loading && data.count === 0 && (
        <p className="text-center py-10 text-slate-500">
          Nenhuma nota fiscal encontrada no período selecionado.
        </p>
      )}

      {!loading && data.count > 0 && (
        <div className="border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº NF</TableHead>
                <TableHead>Nº OS</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Tipo Venda</TableHead>
                <TableHead>OS Franquia</TableHead>
                <TableHead className="text-right">Valor NF</TableHead>
                <TableHead className="text-right">Valor Franquia</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.numeroNF}</TableCell>
                  <TableCell>{item.ordemServico}</TableCell>
                  <TableCell>{item.dataNF}</TableCell>
                  <TableCell>{item.tipoDeVenda}</TableCell>
                  {/* Exibir o número da OS da franquia (ou vazio) */}
                  <TableCell>{item.numOSFranquia || "-"}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(item.valorNF)}
                  </TableCell>
                  <TableCell className="text-right">
                    {/* Exibir o valor da franquia (ou vazio) */}
                    {item.valorFranquia
                      ? formatCurrency(item.valorFranquia)
                      : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

// Helper para FormLabel
function FormLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block mb-1">
      {children}
    </label>
  );
}
