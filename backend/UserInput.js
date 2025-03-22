// backend/UserInput.js
const dynamoClient = require('./dynamoClient');
const { PutCommand, GetCommand, ScanCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');

const TABLE_NAME = 'EmoryHacks'; // Table name

class UserInputService {
    static async create(preferences, userEmail) {
        const timestamp = new Date().toISOString();
        const newPreferenceRecord = {
            EmoryHacks: userEmail, // Primary key for the table
            userEmail: userEmail, // Needed for the GSI "EmailIndex"
            preferences, // The preferences data
            createdAt: timestamp, // Helps with sorting in the GSI
            updatedAt: timestamp // Last update time
        };

        const params = {
            TableName: TABLE_NAME,
            Item: newPreferenceRecord
        };

        await dynamoClient.send(new PutCommand(params));
        return newPreferenceRecord;
    }

    /**
     * Retrieves a record by the primary key.
     * This will return the item where the primary key "EmoryHacks" matches the userEmail
     */
    static async findOne(userEmail) {
        const params = {
            TableName: TABLE_NAME,
            Key: { EmoryHacks: userEmail }
        };

        const result = await dynamoClient.send(new GetCommand(params));
        return result.Item || null;
    }

    /**
     * Retrieves all stored items (for debugging or admin use)
     */
    static async find() {
        const params = { TableName: TABLE_NAME };

        const result = await dynamoClient.send(new ScanCommand(params));
        return result.Items || [];
    }

    /**
     * Example: Retrieve items using the global secondary index "EmailIndex"
     * This method can be useful if you ever store multiple items per email
     */
    static async queryByEmail(userEmail) {
        const params = {
            TableName: TABLE_NAME,
            IndexName: 'EmailIndex',
            KeyConditionExpression: 'userEmail = :email',
            ExpressionAttributeValues: {
                ':email': userEmail
            }
        };

        const result = await dynamoClient.send(new QueryCommand(params));
        return result.Items || [];
    }
}

module.exports = UserInputService;
