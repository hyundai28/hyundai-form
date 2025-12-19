import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DollarSign, FileText, ListChecks } from "lucide-react";
import formatCurrency from "@/utils/converters";
import { DashboardData } from "@/types/notas_banco_schema";

interface MetricsCardsProps {
  data: DashboardData;
  loading: boolean;
}

export function MetricsCards({ data, loading }: MetricsCardsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Valor Total de NF</CardTitle>
          <DollarSign className="h-4 w-4 text-slate-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loading ? "R$ ..." : formatCurrency(data.totalValue.toFixed(2).replace(".", ","))}
          </div>
          <p className="text-xs text-slate-500">No período selecionado</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Notas Fiscais</CardTitle>
          <FileText className="h-4 w-4 text-slate-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{loading ? "..." : data.count}</div>
          <p className="text-xs text-slate-500">Lançamentos realizados</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Valor Médio por NF</CardTitle>
          <ListChecks className="h-4 w-4 text-slate-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loading ? "R$ ..." : formatCurrency(data.averageValue.toFixed(2).replace(".", ","))}
          </div>
          <p className="text-xs text-slate-500">Média de valor por nota</p>
        </CardContent>
      </Card>
    </div>
  );
}