"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { FileText, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { createNotaFiscal } from "@/actions/notas";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const TIPOS_VENDA = ["Franquia", "Seguradora"];

export function NFForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ordemServico: "",
      numeroNF: "",
      dataNF: "",
      valorNF: "",
      desconto: "",
      observacao: "",
      pecas: [{ codigo: "", valor: "" }],
      tipoDeVenda: "",
      numOSFranquia: "",
      valorFranquia: "",
      numNFFranquia: "",
      chassi: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "pecas",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const result = await createNotaFiscal(values);

    if (result.success) {
      toast.success("Formulário enviado com sucesso!", {
        description: "ID da NF: " + result.id,
      });
      form.reset();
      router.push("/");
    } else {
      toast.error("Erro ao salvar!", {
        description: result.error,
      });
    }
    setLoading(false);
  }

  const tipoDeVendaSelecionado = useWatch({
    control: form.control,
    name: "tipoDeVenda",
  });
  const isFranquia = tipoDeVendaSelecionado === "Franquia";

  return (
    <Card className="shadow-sm">
      {/* ... CardHeader (Seção de Título) permanece inalterada ... */}
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <FileText className="w-5 h-5 text-blue-600" />
          Dados da Nota Fiscal
        </CardTitle>
        <CardDescription>
          Preencha as informações da NF e as peças utilizadas.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* --- SEÇÃO DADOS GERAIS (Inalterada) --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="ordemServico"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nº Ordem de serviço</FormLabel>
                    <FormControl>
                      <Input {...field} maxLength={20} placeholder="Ex: 1234" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="numeroNF"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nº da NF</FormLabel>
                    <FormControl>
                      <Input {...field} maxLength={20} placeholder="Ex: 1234" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="dataNF"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de emissão NF</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="valorNF"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor total NF</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        maxLength={30}
                        onChange={(e) => {
                          const masked = formatCurrency(e.target.value);
                          field.onChange(masked);
                        }}
                        placeholder="R$ 0,00"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* --- SEÇÃO DE PEÇAS (DINÂMICO ATUALIZADO) --- */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel className="text-base font-semibold text-slate-700">
                  Códigos e Valores das Peças
                </FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
                  // Adiciona um novo item vazio com os dois campos
                  onClick={() => append({ codigo: "", valor: "" })}
                >
                  <Plus className="w-4 h-4" />
                  Adicionar Peça
                </Button>
              </div>

              <div className="space-y-3">
                {fields.map((field, index) => (
                  // Mantemos items-center, mas corrigimos o deslocamento com mt-8
                  <div key={field.id} className="flex gap-3 items-center">
                    {/* ENVOLVE OS DOIS CAMPOS EM UM ÚNICO GRID (2 COLUNAS) */}
                    <div className="grid grid-cols-2 gap-4 flex-1">
                      {/* Campo CÓDIGO */}
                      <FormField
                        control={form.control}
                        name={`pecas.${index}.codigo`}
                        render={({ field }) => (
                          <FormItem className="space-y-1.5">
                            {/* Label apenas no primeiro item */}
                            {index === 0 && (
                              <FormLabel>Código da Peça</FormLabel>
                            )}
                            <FormControl>
                              <Input {...field} placeholder="Código da peça" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Campo VALOR da Peça */}
                      <FormField
                        control={form.control}
                        name={`pecas.${index}.valor`}
                        render={({ field }) => (
                          <FormItem className="space-y-1.5">
                            {/* Label apenas no primeiro item */}
                            {index === 0 && (
                              <FormLabel>Valor da Peça com desconto</FormLabel>
                            )}
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="R$ 0,00"
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

                    {/* Botão de Remover */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      // NOVIDADE: Adiciona mt-8 (margem superior) se for o primeiro item
                      className={`text-red-500 hover:text-red-700 hover:bg-red-50 ${
                        index === 0 ? "mt-8" : ""
                      }`}
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                ))}
              </div>
              <FormMessage>
                {form.formState.errors.pecas?.root?.message}
              </FormMessage>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="desconto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Desconto Aplicado na NF (%)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: 5.5" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tipoDeVenda"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Selecione o tipo de Venda</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Escolha..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TIPOS_VENDA.map((tipo) => (
                          <SelectItem key={tipo} value={tipo}>
                            {tipo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* IMPLEMENTAÇÃO DA LÓGICA CONDICIONAL */}
            {isFranquia && (
              <>
                <FormLabel className="text-base font-semibold text-slate-700">
                  Dados da {form.getValues().tipoDeVenda}
                </FormLabel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Campo: Nº OS franquia */}
                  <FormField
                    control={form.control}
                    name="numOSFranquia"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nº Ordem de Serviço Franquia</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            maxLength={20}
                            placeholder="Ex: OSF1234"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Campo: Nº nf franquia */}
                  <FormField
                    control={form.control}
                    name="numNFFranquia"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nº da NF Franquia</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            maxLength={20}
                            placeholder="Ex: NFF5678"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Campo: valor Franquia */}
                  <FormField
                    control={form.control}
                    name="valorFranquia"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor Franquia</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            maxLength={30}
                            onChange={(e) => {
                              const masked = formatCurrency(e.target.value);
                              field.onChange(masked);
                            }}
                            placeholder="R$ 0,00"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="chassi"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chassi do Veículo</FormLabel>
                        <FormControl>
                          <Input maxLength={17} placeholder="Digite o chassi" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div /> {/* Placeholder para alinhamento */}
                </div>
                <Separator />
              </>
            )}

            {/* --- Observação --- */}
            <FormField
              control={form.control}
              name="observacao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo da concessão do desconto</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={3}
                      maxLength={500}
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="px-10 bg-blue-600 hover:bg-blue-700"
              >
                {loading ? "Enviando..." : "Enviar Cadastro"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
