import { NFForm } from "@/components/forms/nf-form";

export const metadata = {
  title: "Nova Nota Fiscal | Sistema",
  description: "Criação de registro de NF",
};

export default function Page() {
  return (
    <div className="container mx-auto py-10 space-y-8 max-w-4xl">
      {/* Cabeçalho da Página */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Formulário NF
        </h1>
        <p className="text-slate-600">
          Preencha o formulário para criar um novo registro
        </p>
      </div>

      {/* Importação do Formulário Isolado */}
      <NFForm />
          </div>
  );
}