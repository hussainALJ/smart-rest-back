import { z } from "zod";

export const loginSchema = z.object({
  username: z.string({ error: "username is required" }).min(1, "username can't be empty"),
  password: z.string({ error: "password is required" }).min(8, "password must be 8 characters or more")
})