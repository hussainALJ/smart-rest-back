import { z } from "zod";

export const menuSchema = z.object({
  category_id: z.coerce.number().int().positive("Category id must be positive integer"),
  name: z.string().min(1, "Name must be at least 1 chars"),
  description: z.string().min(10, "Description is too short"),
  price: z.coerce.number().int().positive("Price must be a positive integer"),
  image_url: z.url("Invalid image URL"),
  is_available: z.boolean(),
});
