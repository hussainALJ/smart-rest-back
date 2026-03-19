import { z } from "zod";

export const userSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["Admin", "Chef", "Waiter", "Cashier"], {
    error: "Role must be one of: Admin, Chef, Waiter, Cashier",
  }),
});