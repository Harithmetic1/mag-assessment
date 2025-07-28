import { z } from "zod"

export const bookingPayloadValidation = z.object({
    bookingBusinessName: z.string(),
    bookingBusinessServiceName: z.string(),
    startTime: z.string().datetime(),
    endTime: z.string().datetime(),
    lead: z.object({
        companyName: z.string(),
        consent: z.boolean(),
        dialCode: z.string(),
        email: z.string().email(),
        environment: z.string(),
        firstName: z.string(),
        ipAddress: z.string(),
        landingURL: z.string(),
        lastName: z.string(),
        message: z.string().optional(),
        mobile: z.string(),
        submissionArea: z.string(),
        website: z.string(),
        budget: z.string().optional(),
        role: z.string().optional(),
    })
})

export type bookingPayload = z.infer<typeof bookingPayloadValidation>