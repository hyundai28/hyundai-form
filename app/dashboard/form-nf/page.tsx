"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import formatCurrency from "@/utils/converters";
import { formSchema } from "@/types/form_types";
import { FileText } from "lucide-react";

export default function MeuFormulario() {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ordemServico: "",
      numeroNF: "",
      dataNF: "",
      valorNF: "",
      desconto: "",
      observacao: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    const payload = {
      ...values,
      valorNF: Number(values.valorNF.replace(/\D/g, "")) / 100,
      desconto: values.desconto
        ? Number(values.desconto.replace(/\D/g, "")) / 100
        : 0,
    };

    console.log("ENVIADO:", payload);

    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
  }

  return (
    <div className="space-y-8">
      {/* Título da Página */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Formulário NF
        </h1>
        <p className="text-slate-600">
          Preencha o formulário para criar um novo registro
        </p>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <FileText className="w-5 h-5 text-blue-600" />
            Dados da Nota Fiscal
          </CardTitle>

          <CardDescription>
            Preencha os campos abaixo com as informações da nota fiscal / ordem
            de serviço
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              {/* GRID LINHA 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nº Ordem */}
                <FormField
                  control={form.control}
                  name="ordemServico"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel>Nº Ordem de serviço</FormLabel>
                      <FormControl>
                        <Input {...field} maxLength={20} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Nº NF */}
                <FormField
                  control={form.control}
                  name="numeroNF"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel>Nº da NF</FormLabel>
                      <FormControl>
                        <Input {...field} maxLength={20} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* GRID LINHA 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Data NF */}
                <FormField
                  control={form.control}
                  name="dataNF"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel>Data da NF</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Valor NF */}
                <FormField
                  control={form.control}
                  name="valorNF"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel>Valor NF</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          maxLength={30}
                          onChange={(e) => {
                            const masked = formatCurrency(e.target.value);
                            field.onChange(masked);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* GRID LINHA 3 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Desconto */}
                <FormField
                  control={form.control}
                  name="desconto"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel>Desconto concedido Peças</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          maxLength={30}
                          onChange={(e) => {
                            const masked = formatCurrency(e.target.value);
                            field.onChange(masked);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Observação */}
              <FormField
                control={form.control}
                name="observacao"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel>
                      Motivo da concessão do desconto adicional
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={4}
                        maxLength={500}
                        className="resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Botão */}
              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="px-10 bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? "Enviando..." : "Enviar"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
