import { z } from "zod";

export const workAreaSchema = z.object({
  date: z.string().min(1, "Please select a date for the work area"),
  areaLabel: z
    .string()
    .min(2, "Area label must be at least 2 characters")
    .max(100, "Area label cannot exceed 100 characters"),
  postcodes: z.string().optional(),
});

export type WorkAreaFormData = z.infer<typeof workAreaSchema>;
