import z from "zod";

export const menuUpdateSchema = z.object({
  category_id: z.coerce.number().int().positive("Category id must be positive integer").optional(),
  name: z.string().min(1, "Name must be at least 1 chars").optional(),
  description: z.string().min(10, "Description is too short").optional(),
  price: z.coerce.number().int().positive("Price must be a positive integer").optional(),
  image_url: z.url("Invalid image URL").optional(),
  is_available: z.boolean().optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided to update" }
);