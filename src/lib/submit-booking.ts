"use server";
import { tryCatch } from "@/app/utils/utils";
import { ZodError } from "zod";
import { bookingPayload, bookingPayloadValidation } from "./validation";


export const submitBooking = async (bookingPayload: bookingPayload) => {
    const { data: validatedPayload, error: validatePayloadErr } = await tryCatch(bookingPayloadValidation.parseAsync(bookingPayload), ZodError);

    if (validatePayloadErr !== null){
        return {
            data: null,
            error: `Could not validate payload: ${validatePayloadErr.message}`
        }
    }

    const { data: makeBooking, error: makeBookingError } = await tryCatch(
        fetch(`${process.env.MAG_BOOKING_API}/booking`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(validatedPayload)
        })
    )

    if (makeBookingError){
        return {
            data: null,
            error: `Could not make booking: ${makeBookingError.message}`
        }
    }

    const { data: parsedResponse, error: parseResponseErr } = await tryCatch(makeBooking.json())

    if(parseResponseErr !== null){
        return {
            data: null,
            error: `Could not parse response: ${parseResponseErr.message}`
        }
    }

    if(!makeBooking.ok){
        return {
            data: null,
            error: `Could not make booking: ${parsedResponse.error}`
        }
    }

    return {
        data: parsedResponse,
        error: null
    };
}