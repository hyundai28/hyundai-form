import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { DashboardData } from "@/types/notas_banco_schema";

interface ExportButtonProps {
  data: DashboardData;
  startDate: string;
  endDate: string;
  loading: boolean;
}

export function ExportButton({ data, startDate, endDate, loading }: ExportButtonProps) {
  const exportToCSV = () => {
    if (data.items.length === 0) return;
    const headers = [
      "Dealer Code",
      "N NF",
      "N OS",
      "chassi",
      "Data",
      "Tipo Venda",
      "Codigo Peca",
      "Valor Peca (R$)",
      "Valor NF (R$)",
    ];
    const csvRows = data.items.flatMap((item) => {
      const chassiValue = item.chassi ? item.chassi : "-";
      if (!item.pecas || item.pecas.length === 0) {
        return [
          [
            item.dealerCode,
            item.numeroNF,
            item.ordemServico,
            chassiValue,
            item.dataNF,
            item.tipoDeVenda,
            "",
            "",
            item.valorNF,
          ].join(";"),
        ];
      }
      return item.pecas.map((peca) => [
        item.dealerCode,
        item.numeroNF,
        item.ordemServico,
        chassiValue,
        item.dataNF,
        item.tipoDeVenda,
        peca.codigo,
        peca.valor,
        item.valorNF,
      ].join(";"));
    });
    const csvContent = [headers.join(";"), ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `relatorio_nf_com_pecas_${startDate}_a_${endDate}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Button
      onClick={exportToCSV}
      disabled={data.count === 0 || loading}
      className="gap-2 bg-green-600 hover:bg-green-700 w-full md:w-auto"
    >
      <Download className="w-4 h-4" />
      Exportar CSV ({data.count} itens)
    </Button>
  );
}