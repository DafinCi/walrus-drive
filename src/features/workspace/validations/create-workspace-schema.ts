import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Nama workspace minimal 3 karakter" })
    .max(50, { message: "Nama workspace maksimal 50 karakter" })
    .refine((val) => val.trim().length > 0, {
      message: "Nama workspace tidak boleh hanya berisi spasi kosong",
    }),

  slug: z
    .string()
    .min(3, { message: "Slug minimal 3 karakter" })
    .max(40, { message: "Slug maksimal 40 karakter" })
    .toLowerCase()
    .trim()
    .regex(/^[a-z0-9-]+$/, {
      message:
        "Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung (-)",
    })
    .refine((val) => !val.startsWith("-") && !val.endsWith("-"), {
      message: "Slug tidak boleh diawali atau diakhiri dengan tanda hubung (-)",
    }),

  description: z
    .string()
    .max(160, { message: "Deskripsi tidak boleh lebih dari 160 karakter" })
    .optional()
    .or(z.literal("")),

  visibility: z.enum(["private", "public"], {
    message: "Visibilitas harus bernilai 'private' atau 'public'",
  }),

  upload_policy: z.enum(
    ["owner_only", "admins_only", "members_only", "public"],
    {
      message: "Kebijakan unggah file tidak valid",
    },
  ),
});

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;
