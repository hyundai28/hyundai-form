import { z } from "zod";

export const formSchema = z.object({
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
});
