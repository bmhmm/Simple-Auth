import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(1, "Name is required").trim(),
  email: z.string().email("Invalid email address").trim(),
  message: z.string().min(10, "Message must be at least 10 characters long").max(500, "Message is too long"),
});

export type FormData = z.infer<typeof formSchema>;