import { z } from "zod";

export const orderSchema = z.object({
  session_id: z.coerce.number().int().positive("session_id must be a positive integer"),
  items: z
    .array(
      z.object({
        menu_item_id: z.coerce.number().int().positive("menu_item_id must be a positive integer"),
        quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
        notes: z.string().optional(),
      })
    )
    .min(1, "At least one item is required"),
});

export const orderStatusSchema = z.object({
  status: z.enum(["Pending", "Preparing", "Ready", "Served", "Paid", "Canceled"]),
});