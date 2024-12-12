import { AttributeDefinition, CreateTableCommand, DynamoDBClient, DynamoDBClientConfig, KeySchemaElement } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, GetCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { bookingType } from "../booking/model";
import { STSClient, GetSessionTokenCommand } from "@aws-sdk/client-sts";
import { fromTemporaryCredentials } from "@aws-sdk/credential-providers";
import { ZodError } from "zod";

interface DynamoDbServiceType{
    securityClient: STSClient
    client: DynamoDBClient
    docClient: DynamoDBDocumentClient
    attributesToGet: string[]
}

const AWS_CONFIG: DynamoDBClientConfig = {
    region: "eu-north-1",
    credentials: fromTemporaryCredentials({
        masterCredentials:  {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
            // sessionToken: process.env.AWS_SESSION_TOKEN ?? ""
        },
        params: {
            RoleArn: process.env.AWS_DYNAMO_DB_ROLE
        },
        clientConfig: {
            region: "eu-north-1"
        }
    }),
}


class DynamoDbService implements DynamoDbServiceType{
    securityClient: STSClient;
    client: DynamoDBClient;
    docClient: DynamoDBDocumentClient;
    attributesToGet: string[];

    constructor(){
        this.securityClient = new STSClient({
             region: AWS_CONFIG.region
        });
        this.client = new DynamoDBClient(AWS_CONFIG)
        this.docClient = DynamoDBDocumentClient.from(this.client);
        this.attributesToGet = ["bookingEmail", "bookingDate", "bookingTime"]
    }

    async getAWSCredentials(){
        try {
            const input = {
                "DurationSeconds": 3600 * 4
            }
            const command = new GetSessionTokenCommand(input);
            const response = await this.securityClient.send(command);
            console.log(response);
    
            this.client = new DynamoDBClient({
                region: "eu-north-1",
                credentials: {
                    accessKeyId: response.Credentials?.AccessKeyId ?? "",
                    secretAccessKey: response.Credentials?.SecretAccessKey ?? "",
                    sessionToken: response.Credentials?.SessionToken
                }
            })

            this.docClient = DynamoDBDocumentClient.from(this.client);

            return response; 
        } catch (error) {
            LogError({ message: "Could not get AWS credentials", error })
        }   
    }

    async createTable({ tableName, attributeDefinitions, keySchema }: { tableName: string, attributeDefinitions: AttributeDefinition[], keySchema: KeySchemaElement[] }){
        try {
            const command = new CreateTableCommand({
                TableName: tableName,
                AttributeDefinitions: attributeDefinitions,
                KeySchema: keySchema
            })

            const dbResponse = await this.client.send(command);
            return dbResponse;
        } catch (error) {
            throw new Error(LogError({ message: "Could not create table", error }))
        }
    }

    async getAllItems( { tableName, attributesToGet }: {tableName: string, attributesToGet?: string[]}){
        try {
            const command = new ScanCommand({
                TableName: tableName,
                AttributesToGet: attributesToGet ?? this.attributesToGet
            }) 

            const dbResponse = await this.docClient.send(command);
            // Handle empty results
          if (!dbResponse.Items || dbResponse.Items.length === 0) {
              console.warn("No items found for the provided query");
          }
          return dbResponse.Items;
        } catch (error) {
            throw new Error(LogError({ message: "Could not get all Items", error }))
        }
    }

    async getItem({tableName, query, attributesToGet} : {tableName: string, query:  Record<string, any> | undefined, attributesToGet?: string[]}){
        try {
            const command = new GetCommand({
                TableName: tableName,
                Key: { ...query },
                AttributesToGet: attributesToGet ?? this.attributesToGet
            })

            const dbResponse = await this.docClient.send(command);
            // Handle empty results
          if (!dbResponse.Item || dbResponse.Item.length === 0) {
              console.warn("No items found for the provided query");
          }
          return dbResponse.Item
        } catch (error) {
            throw new Error(LogError({ message: "Could not get data from Dynamo DB", error }))
        }
    }

    async queryTable({ tableName, query, expressionAttributes }: { tableName: string, query: string, expressionAttributes: Record<string, any> }){
        try {
            console.log(tableName, query, expressionAttributes);
            
            const command = new QueryCommand({
                TableName: tableName,
                KeyConditionExpression: query,
                ExpressionAttributeValues: expressionAttributes,

                // ConsistentRead: true
            })

            const dbResponse = await this.docClient.send(command);
              // Handle empty results
            if (!dbResponse.Items || dbResponse.Items.length === 0) {
                console.warn("No items found for the provided query");
            }
            return dbResponse.Items;
        } catch (error) {
            throw new Error(LogError({ message: "Could not query items", error }))
        }
    }

    async putItem({ tableName, item }: { tableName: string, item: Record<string, any> | undefined }){
        try {
            const command = new PutCommand({
                TableName: tableName,
                Item: item
            })

            const response = await this.docClient.send(command)
            return response;
        } catch (error) {
            throw new Error(LogError({ message: "Could not create item", error }))
        }
    }

    // This generates a KeyConditionExpression for queries that are mutually inclusive.
    generateBookingKeyConditionExpression(query: bookingType){
        const queryExpression = [];
        const expressionAttributeValues: Record<string, any> = {};
        for (const [key, value] of Object.entries(query)){
            if(value){
                queryExpression.push(`${key} = :${key}`)
                expressionAttributeValues[`:${key}`] = value;
            }
        }

        // console.log(`Key Condition Ex: ${queryExpression.join(" AND ")}, Expression Attribute Value: ${JSON.stringify(expressionAttributeValues)}`);

        return {
            KeyConditionExpression: queryExpression.join(" AND "),
            ExpressionAttributeValues: expressionAttributeValues
        }
    }
}

export default DynamoDbService;


// helper function to help log and return errors
export const LogError = ({ error, message, printStack = false} :{error: any, message: string, printStack?: boolean}) => {
    
    if (error instanceof ZodError){
        if(printStack){
            console.error(`Stack Trace: ${error.stack}`)
        }

        const validationErrors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join('; ')

        console.log(`ZodError ${message}: ${error.message}`);
        
        return `${message}: Validation failed ${validationErrors}`
    } 

    if(error instanceof Error){
        if(printStack){
            console.error(`Stack Trace: ${error.stack}`)
        }
        console.log(`Error ${message}: ${error.message}`);

        return `${message}: ` + error.message
    } 

}