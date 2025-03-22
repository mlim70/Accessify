const { PutCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient } = require('./dynamoClient');

const TABLE_NAME = 'UserInputs';

const UserInputService = {
    async create(input) {
        const item = {
            id: Date.now().toString(), // Using timestamp as ID
            input: input,
            timestamp: new Date().toISOString()
        };

        await docClient.send(new PutCommand({
            TableName: TABLE_NAME,
            Item: item
        }));

        return item;
    },

    async findOne(conditions) {
        const { Items } = await docClient.send(new QueryCommand({
            TableName: TABLE_NAME,
            IndexName: 'UrlPreferencesIndex',
            KeyConditionExpression: 'input.url = :url AND input.preferences.colorBlindness = :colorBlindness',
            FilterExpression: 'input.preferences.dyslexia = :dyslexia',
            ExpressionAttributeValues: {
                ':url': conditions['input.url'],
                ':colorBlindness': conditions['input.preferences.colorBlindness'],
                ':dyslexia': conditions['input.preferences.dyslexia']
            },
            Limit: 1,
            ScanIndexForward: false // This will get the most recent first
        }));

        return Items?.[0] || null;
    },

    async find() {
        const { Items } = await docClient.send(new QueryCommand({
            TableName: TABLE_NAME,
            IndexName: 'TimestampIndex',
            ScanIndexForward: false // This will sort by timestamp descending
        }));

        return Items || [];
    }
};

module.exports = UserInputService;