"use server";

import { z } from "zod";
import { formSchema } from "@/types/form_types";
import { currentUser } from "@clerk/nextjs/server";
import { supabase_server } from "@/lib/supabase_server";
import { convertToFloat } from "@/utils/converters";

type FormPayload = z.infer<typeof formSchema>;

export async function createNotaFiscal(formData: FormPayload) {
  // 1. Validação dos Dados (Inalterada)
  const validation = formSchema.safeParse(formData);
  if (!validation.success) {
    return { success: false, error: "Dados inválidos." };
  }
  const values = validation.data;

  // 2. 🔑 Autenticação e Contexto do Usuário (Clerk)
  const user = await currentUser();

  if (!user) {
    return { success: false, error: "Usuário não autenticado." };
  }

  const dealerCode = user.publicMetadata.dealer_code as string | undefined;
  const dealerName = user.publicMetadata.dealer_name as string | undefined;

  if (!dealerCode || !dealerName) {
    return {
      success: false,
      error: "Metadados do revendedor (Dealer Code/Name) ausentes.",
    };
  }

  // 4. Pré-processamento e Conversão (Inalterada)
  const valorNF_float = convertToFloat(values.valorNF);
  const desconto_percentual_float = convertToFloat(values.desconto);
  const valorFranquia_float = values.valorFranquia
    ? convertToFloat(values.valorFranquia)
    : null;

  // 5. Prepara os dados da tabela principal (`notas_fiscais`)
  const notaData = {
    ordem_servico: values.ordemServico,
    numero_nf: values.numeroNF,
    data_nf: values.dataNF,
    valor_nf: valorNF_float,
    desconto_percentual: desconto_percentual_float,
    observacao: values.observacao || null,
    // 🔥 DADOS DO CLERK
    dealer_code: dealerCode,
    dealer_name: dealerName,
    user_id: user.id, // ID único do usuário no Clerk
    tipo_de_venda: values.tipoDeVenda,
    num_os_franquia: values.numOSFranquia || null,
    valor_franquia: valorFranquia_float,
    num_nf_franquia: values.numNFFranquia || null,
  };

  // 6. Inserir na tabela Principal (`notas_fiscais`)
  const { data: nota, error: notaError } = await supabase_server
    .from("notas_fiscais")
    .insert([notaData])
    .select("id")
    .single();

  if (notaError) {
    console.error("Erro ao inserir Nota Fiscal:", notaError);
    return { success: false, error: "Falha ao salvar a Nota Fiscal." };
  }

  const notaFiscalId = nota.id;

  // 7. Prepara e insere os dados da tabela de peças (`nf_pecas`)
  const pecasData = values.pecas.map((peca) => ({
    nota_fiscal_id: notaFiscalId,
    codigo: peca.codigo,
    valor: Number(peca.valor.replace(/\D/g, "")) / 100,
  }));

  const { error: pecasError } = await supabase_server
    .from("nf_pecas")
    .insert(pecasData);

  if (pecasError) {
    console.error("Erro ao inserir Peças:", pecasError);
    return { success: false, error: "Falha ao salvar as Peças." };
  }

  return {
    success: true,
    message: "Nota Fiscal e Peças salvas com sucesso!",
    id: notaFiscalId,
  };
}
