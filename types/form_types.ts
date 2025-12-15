import { z } from "zod";

export const formSchema = z
  .object({
    ordemServico: z
      .string()
      .min(1, "Obrigatório")
      .max(20, "Máximo 20 caracteres"),

    numeroNF: z.string().min(1, "Obrigatório").max(20, "Máximo 20 caracteres"),

    dataNF: z
      .string()
      .min(1, "Obrigatório")
      .refine((v) => !isNaN(Date.parse(v)), "Data inválida"),

    valorNF: z.string().min(1, "Obrigatório").max(30),

    desconto: z.string().max(30).optional(),

    observacao: z.string().max(500, "Máximo 500 caracteres").optional(),
    pecas: z
      .array(
        z.object({
          codigo: z.string().min(1, "Código obrigatório"),
          valor: z
            .string()
            .min(1, "Valor Obrigatório")
            .max(20, "Máximo 20 caracteres"),
        })
      )
      .min(1, "Adicione pelo menos uma peça"),

    numOSFranquia: z.string().optional(), // Assumindo opcional, ajuste para min(1) se for obrigatório
    valorFranquia: z.string().optional(), // Assumindo opcional, ajuste e use o formato de moeda se necessário
    numNFFranquia: z.string().optional(), // Assumindo opcional
    tipoDeVenda: z.string().min(1, { message: "Selecione o Tipo de Venda." }),
  })
  .refine(
    (data) => {
      // Se o tipo de venda for 'Franquia', verifique se os campos de franquia estão preenchidos
      if (data.tipoDeVenda === "Franquia") {
        // Exemplo: Torna o valorFranquia obrigatório apenas para Franquia
        return data.valorFranquia && data.valorFranquia.length > 0;
      }
      return true; // Se não for Franquia, a validação passa.
    },
    {
      message: "O Valor Franquia é obrigatório para vendas do tipo Franquia.",
      path: ["valorFranquia"], // Campo ao qual a mensagem de erro será anexada
    }
  );

  export type FormSchemaType = z.infer<typeof formSchema>;