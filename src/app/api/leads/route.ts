import { NextRequest, NextResponse } from "next/server";
import { leadPayloadSchema } from "./model";
import DynamoDbService, { LogError } from "../utils/utils";
import { randomUUID } from "crypto";


const dynamoDbService = new DynamoDbService()

export async function POST(request: NextRequest){
    try {
        const requestData = await request.formData()

        const leadPayload = Object.fromEntries(requestData);
        
        const leadPayloadUUID = randomUUID()

        const fullLeadPayload = {
            ...leadPayload,
            leadId: leadPayloadUUID,
            consent: leadPayload.consent == "true" ? true : false
        }
        
        const validatedPayload = leadPayloadSchema.parse(fullLeadPayload);

        // Add the creation date timestamp
        validatedPayload.createdAt = String(new Date());

        const createLeadRequest = await dynamoDbService.putItem({ tableName: "Leads", item: validatedPayload })

        return NextResponse.json({
            success: true,
            message: "Lead created successfully",
            data: createLeadRequest
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: LogError({ message: "Could not post leads", error })
        }, { 
            status: 500
        }) 
    }
}