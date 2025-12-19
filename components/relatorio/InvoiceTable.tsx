/* eslint-disable react-hooks/incompatible-library */
import { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp } from "lucide-react";
import { DashboardData } from "@/types/notas_banco_schema";
import formatCurrency from "@/utils/converters";
import { DataTablePagination } from "@/components/ui/data-table-pagination"; // Seu componente de paginação
import React from "react";

type NotaFiscalDashboardItem = DashboardData["items"][0]; // Tipo para itens

interface InvoiceTableProps {
  data: DashboardData;
  loading: boolean;
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
}

export function InvoiceTable({
  data,
  loading,
  globalFilter,
  setGlobalFilter,
}: InvoiceTableProps) {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const columns: ColumnDef<NotaFiscalDashboardItem>[] = [
    {
      id: "expander",
      header: "",
      cell: ({ row }) => (
        <div className="w-8 text-center">
          {row.original.pecas?.length > 0 ? (
            expandedRows[row.original.id] ? (
              <ChevronUp />
            ) : (
              <ChevronDown />
            )
          ) : null}
        </div>
      ),
    },
    { accessorKey: "dealerCode", header: "Dealercode" },
    { accessorKey: "numeroNF", header: "Nº NF" },
    { accessorKey: "ordemServico", header: "Nº OS" },
    {
      accessorKey: "chassi",
      header: "Chassi",
      cell: ({ row }) => (
        <div className="font-mono text-sm">{row.original.chassi || "-"}</div>
      ),
    },
    { accessorKey: "dataNF", header: "Data" },
    { accessorKey: "tipoDeVenda", header: "Tipo Venda" },
    {
      accessorKey: "numOSFranquia",
      header: "OS Franquia",
      cell: ({ row }) => row.original.numOSFranquia || "-",
    },
    {
      accessorKey: "valorNF",
      header: () => <div className="text-right">Valor NF</div>,
      cell: ({ row }) => (
        <div className="text-right">{formatCurrency(row.original.valorNF)}</div>
      ),
    },
    {
      accessorKey: "valorFranquia",
      header: () => <div className="text-right">Valor Franquia</div>,
      cell: ({ row }) => (
        <div className="text-right">
          {row.original.valorFranquia
            ? formatCurrency(row.original.valorFranquia)
            : "-"}
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: data.items,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (loading) return <p className="text-center py-10">Carregando dados...</p>;

  return (
    <div className="space-y-4">
      {/* INPUT DE FILTRO SEMPRE VISÍVEL */}
      <Input
        placeholder="Filtrar por Dealercode..."
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="max-w-sm"
      />

      {/* CONTEÚDO PRINCIPAL: loading, vazio ou tabela */}
      {loading ? (
        <div className="text-center py-10">
          <p>Carregando dados...</p>
        </div>
      ) : data.count === 0 ? (
        <div className="text-center py-10">
          <p className="text-slate-500">
            Nenhuma nota fiscal encontrada para o filtro aplicado.
          </p>
          <p className="text-sm text-slate-400 mt-2">
            Tente ajustar o período ou limpar o filtro.
          </p>
        </div>
      ) : (
        <>
          {/* Tabela com dados */}
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => {
                  const isExpanded = expandedRows[row.original.id];
                  return (
                    <React.Fragment key={row.id}>
                      <TableRow
                        className="cursor-pointer hover:bg-slate-50"
                        onClick={() => toggleRow(row.original.id)}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>

                      {isExpanded && row.original.pecas?.length > 0 && (
                        <TableRow className="bg-slate-50">
                          <TableCell colSpan={columns.length}>
                            <div className="p-3">
                              <p className="text-sm font-semibold mb-2">
                                Peças
                              </p>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Código</TableHead>
                                    <TableHead className="text-right">
                                      Valor (R$)
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {row.original.pecas.map((peca) => (
                                    <TableRow key={peca.id}>
                                      <TableCell>{peca.codigo}</TableCell>
                                      <TableCell className="text-right">
                                        {formatCurrency(peca.valor)}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* PAGINAÇÃO SEMPRE VISÍVEL */}
          <DataTablePagination table={table} />
        </>
      )}
    </div>
  );
}
