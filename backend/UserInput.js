const dynamoClient = require('./dynamoClient');
const { PutCommand, ScanCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');

const TABLE_NAME = 'EmoryHacks'; //DynamoDB table name

class UserInputService {
    static async create(input, userEmail) {
        const TTL_DAYS = 30; // Keep enhancements for 30 days
        const ttl = Math.floor(Date.now() / 1000) + (TTL_DAYS * 24 * 60 * 60);
        
        // Create composite key including preferences
        const emailUrlKey = `${userEmail}#${input.url}#${input.preferences.colorBlindness || 'none'}#${input.preferences.dyslexia || 'false'}`;
        
        const newInput = {
            id: Date.now().toString(),
            userEmail,
            emailUrlKey,
            input,
            createdAt: new Date().toISOString(),
            ttl: ttl // Add TTL field
        };

        const params = {
            TableName: TABLE_NAME,
            Item: newInput
        };

        await dynamoClient.send(new PutCommand(params));
        return newInput;
    }

    static async find() {
        const params = {
            TableName: TABLE_NAME
        };

        const result = await dynamoClient.send(new ScanCommand(params));
        return result.Items || [];
    }

    static async findOne(query) {
        if (!query.userEmail) {
            throw new Error('userEmail is required');
        }

        if (query['input.url']) {
            // Create composite key with preferences
            const emailUrlKey = `${query.userEmail}#${query['input.url']}#${query['input.preferences.colorBlindness'] || 'none'}#${query['input.preferences.dyslexia'] || 'false'}`;
            
            const params = {
                TableName: TABLE_NAME,
                IndexName: 'EmailUrlIndex',
                KeyConditionExpression: 'emailUrlKey = :emailUrlKey',
                ExpressionAttributeValues: {
                    ':emailUrlKey': emailUrlKey
                }
            };

            const result = await dynamoClient.send(new QueryCommand(params));
            return result.Items?.[0] || null;
        }

        return this.findByEmail(query.userEmail);
    }

    static async findByEmail(userEmail) {
        const params = {
            TableName: TABLE_NAME,
            IndexName: 'EmailIndex',
            KeyConditionExpression: 'userEmail = :email',
            ExpressionAttributeValues: {
                ':email': userEmail
            },
            ScanIndexForward: false // Get most recent first
        };

        const result = await dynamoClient.send(new QueryCommand(params));
        return result.Items || [];
    }

    static async findMultiple(queries) {
        const batchParams = queries.map(query => ({
            TableName: TABLE_NAME,
            IndexName: 'EmailUrlIndex',
            KeyConditionExpression: 'emailUrlKey = :emailUrlKey',
            ExpressionAttributeValues: {
                ':emailUrlKey': `${query.userEmail}#${query.url}#${query.preferences.colorBlindness || 'none'}#${query.preferences.dyslexia || 'false'}`
            }
        }));

        // Execute queries in parallel
        const results = await Promise.all(
            batchParams.map(params => dynamoClient.send(new QueryCommand(params)))
        );
        return results.map(result => result.Items?.[0] || null);
    }
}

module.exports = UserInputService;