import { z } from "zod"

// creating a schema for bookings
export const bookingPayloadSchema = z.object({
    bookingEmail: z.string().email({ message: "Invalid email address" }),
    bookingDate: z.string().date("Please select a valid date"),
    bookingTime: z.string().time({ message: "Please select a valid booking time" }),
    bookingName: z.string(),
    bookingPhoneNumber: z.string().trim().min(5, "Phone number is too short!").max(15, "Phone number too long!"),
    bookingNote: z.string(),
    bookingConsent: z.boolean({ message: "Consent is required!" }).refine((consent) => consent === true, {
        message: "User consent is required!"
    }),
    updatedAt: z.string().date().optional(),
    createdAt: z.string().date().optional()
})

export const agentLead = z.object({
    email: z.string({ message: "Email address is required" }),
    name: z.string(),
    mobile: z.string().trim().min(5, "Phone number is too short!").max(15, "Phone number too long!"),
    companyName: z.string(),
    message: z.string(),
})

export type agentLeadType = z.infer<typeof agentLead>

export type bookingType = z.infer<typeof bookingPayloadSchema>;
