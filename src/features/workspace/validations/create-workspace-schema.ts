import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Workspace name must be at least 3 characters." })
    .max(50, { message: "Workspace name must not exceed 50 characters." })
    .refine((val) => val.trim().length > 0, {
      message: "Workspace name cannot be empty or whitespace only.",
    }),

  slug: z
    .string()
    .min(3, { message: "Slug must be at least 3 characters." })
    .max(40, { message: "Slug must not exceed 40 characters." })
    .toLowerCase()
    .trim()
    .regex(/^[a-z0-9-]+$/, {
      message:
        "Slug may only include lowercase letters, numbers, and hyphens (-).",
    })
    .refine((val) => !val.startsWith("-") && !val.endsWith("-"), {
      message: "Slug cannot start or end with a hyphen (-).",
    }),

  description: z
    .string()
    .max(160, { message: "Description cannot be longer than 160 characters." })
    .optional()
    .or(z.literal("")),

  visibility: z.enum(["private", "public"], {
    message: "Visibility must be set to 'private' or 'public'.",
  }),

  upload_policy: z.enum(
    ["owner_only", "admins_only", "members_only", "public"],
    {
      message: "The file upload policy is invalid.",
    },
  ),
});

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;
