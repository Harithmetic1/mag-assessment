import { z } from "zod";


export const leadPayloadSchema = z.object({
    leadId: z.string().uuid("Lead Id should be in UUID format"),
    fullName: z.string({ message: "Full Name is required" }).min(3, "Full Name is too short"),
    email: z.string().email("Invalid email format"),
    consent: z.boolean({ message: "Consent is required!" }).refine((consent) => consent === true, {
        message: "User consent is required!"
    }),
    updatedAt: z.string().date().optional(),
    createdAt: z.string().date().optional()
})

export type leadPayloadType = z.infer<typeof leadPayloadSchema>;