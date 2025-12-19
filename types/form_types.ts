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

    numOSFranquia: z.string().optional(),
    valorFranquia: z.string().optional(),
    numNFFranquia: z.string().optional(),
    tipoDeVenda: z.string().min(1, { message: "Selecione o Tipo de Venda." }),
    chassi: z
      .string()
      .max(17, "O Chassi deve ter no máximo 17 caracteres")
      .optional(),
  })
  .refine(
    (data) => {
      if (data.tipoDeVenda === "Franquia") {
        return data.valorFranquia && data.valorFranquia.length > 0;
      }
      return true;
    },
    {
      message: "O Valor Franquia é obrigatório para vendas do tipo Franquia.",
      path: ["valorFranquia"],
    }
  );

export type FormSchemaType = z.infer<typeof formSchema>;
