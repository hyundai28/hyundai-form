import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Cards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[
        { label: "Total de NFs", value: "1.234" },
        { label: "NFs Processadas", value: "856" },
        { label: "Pendentes", value: "378" },
      ].map((stat, idx) => (
        <Card key={idx}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              {stat.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {stat.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
