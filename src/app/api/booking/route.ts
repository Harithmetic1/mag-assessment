import { NextRequest, NextResponse } from "next/server";
import DynamoDbService, { LogError } from "../utils/utils";
import { bookingPayloadSchema, bookingType } from "./model";


const dynamoDbService = new DynamoDbService()

export async function GET(request: NextRequest) {
    try {
        const bookingsQueryObj: bookingType = {
            bookingEmail: "",
            bookingDate: "",
            bookingName: "",
            bookingTime: "",
            bookingNote: "",
            bookingPhoneNumber: "",
            bookingConsent: false,
        }
        // Get the request parameters
        const searchParams = request.nextUrl.searchParams;

        let getAllBookingsResponse;

        // If the request comes with filter parameters
        if (searchParams.size !== 0){
            const queryParams = Object.fromEntries(searchParams);

            const { KeyConditionExpression, ExpressionAttributeValues } = dynamoDbService.generateBookingKeyConditionExpression({ ...bookingsQueryObj, ...queryParams })

            getAllBookingsResponse = await dynamoDbService.queryTable({ tableName: "Bookings", query: KeyConditionExpression, expressionAttributes: ExpressionAttributeValues })
        } else {
            getAllBookingsResponse = await dynamoDbService.getAllItems({tableName: "Bookings"})
        }

        return NextResponse.json({
            success: true,
            data: getAllBookingsResponse
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: LogError({message: `Error getting all bookings`, error, printStack: false}) 
        }, { status: 500 })
    }
}

export async function POST(request: NextRequest){
    try {

        const requestData = await request.formData()
        
        const createBookingPayload = Object.fromEntries(requestData)
        
        // transform payload
        const fullBookingPayload = {
            ...createBookingPayload,
            bookingConsent: createBookingPayload.bookingConsent  == "true" ? true : false
        }

        // validate payload
        const validatedPayload = bookingPayloadSchema.parse(fullBookingPayload);

        // Add the creation date timestamp
        validatedPayload.createdAt = String(new Date());

        // check if the booking time slot exists in the DB
        const existingBooking = await dynamoDbService.getItem({ tableName: "Bookings", query: {
            bookingDate: validatedPayload.bookingDate,
            bookingTime: validatedPayload.bookingTime
        } })

        if (existingBooking){
            throw new Error("Booking time slot already occupied")
        }

        const createBookingsResponse = await dynamoDbService.putItem({ tableName: "Bookings", item: validatedPayload })

        return NextResponse.json({
            success: true,
            message: "Booking created successfully",
            data: createBookingsResponse
        })
    } catch (error) {
       return NextResponse.json({
        success: false,
        error: LogError({message: "Could not create booking", error})
       }, {
        status: 500
       })
    }

}