import { z } from "zod";

const fileSchema = z.object({
  originalname: z.string(),
  mimetype: z.enum(["image/jpeg", "image/jpg", "image/png", "image/webp"]),
  size: z.number().max(5 * 1024 * 1024, "Max file size is 5MB"),
});

const updateUserSchema = z.object({
  username: z.string().optional(),
  profileImage: fileSchema.optional(),
});

export default updateUserSchema;
