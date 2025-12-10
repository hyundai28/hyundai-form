import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"

export default function RelatorioPage() {
  const mockData = [
    { month: "Jan", value: 120 },
    { month: "Fev", value: 150 },
    { month: "Mar", value: 180 },
    { month: "Abr", value: 140 },
    { month: "Mai", value: 200 },
    { month: "Jun", value: 220 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Relatório</h1>
        <p className="text-slate-600 mt-2">Análise de documentos e métricas do sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total de NFs", value: "1.234" },
          { label: "NFs Processadas", value: "856" },
          { label: "Pendentes", value: "378" },
        ].map((stat, idx) => (
          <Card key={idx}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">{stat.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Evolução Mensal
          </CardTitle>
          <CardDescription>Quantidade de documentos processados por mês</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <span className="text-sm font-medium w-10">{item.month}</span>
                <div className="flex-1 bg-slate-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(item.value / 250) * 100}%` }} />
                </div>
                <span className="text-sm font-medium w-12 text-right">{item.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
