import { z } from "zod";

export const loanSchema = z.object({
  userId: z.string().optional(),

  amount: z.coerce.number().min(500, "Mínimo 500").max(50000, "Máximo 50000"),

  term: z.coerce.number().min(6, "Mínimo 6 meses").max(60, "Máximo 60 meses"),

  monthlyIncome: z.coerce.number().min(1, "Ingreso requerido"),

  tea: z.coerce
    .number()
    .min(1, "La tasa debe ser mayor a 0")
    .max(100, "Tasa demasiado alta"),

  loanType: z
    .string()
    .refine((val) => val === "Fixed" || val === "Decreasing", {
      message: "Selecciona un sistema válido",
    }),
});

export type LoanFormData = z.infer<typeof loanSchema>;
