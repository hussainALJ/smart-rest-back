import { z } from "zod";

export const menuSchema = z.object({
  category_id: z
    .int("Category id must be integer and positive")
    .positive("Category id must be positive"),
  name: z.string().min(1, "Name must be at least 1 chars"),
  description: z.string().min(10, "Description is too short"),
  price: z.int().positive("Price must be a positive number"),
  image_url: z.url("Invalid image URL"),
  is_available: z.boolean(),
});
