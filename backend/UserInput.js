// backend/UserInput.js
const dynamoClient = require("./dynamoClient");
const {
  PutCommand,
  GetCommand,
  ScanCommand,
  QueryCommand,
} = require("@aws-sdk/lib-dynamodb");

const TABLE_NAME = "EmoryHacks"; //table name

class UserInputService {
  static async create(preferences, userEmail) {
    const timestamp = new Date().toISOString();
    const newPreferenceRecord = {
      EmoryHacks: userEmail, //primary key for the table
      userEmail: userEmail, //needed for the GSI "EmailIndex"
      preferences: {
        colorBlindFilter: preferences.colorBlindFilter || "none",
        dyslexia: preferences.dyslexia || "none",
        language: preferences.language || "en",
        screenReader: preferences.screenReader || "off",
        imageCaption: preferences.imageCaption || "off",
        additionalInfo: preferences.additionalInfo || "",
      },
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const params = {
      TableName: TABLE_NAME,
      Item: newPreferenceRecord,
    };

    await dynamoClient.send(new PutCommand(params));
    return newPreferenceRecord;
  }

  static async findOne(userEmail) {
    const params = {
      TableName: TABLE_NAME,
      Key: { EmoryHacks: userEmail },
    };

    const result = await dynamoClient.send(new GetCommand(params));
    return result.Item || null;
  }

  static async find() {
    const params = { TableName: TABLE_NAME };

    const result = await dynamoClient.send(new ScanCommand(params));
    return result.Items || [];
  }

  static async queryByEmail(userEmail) {
    const params = {
      TableName: TABLE_NAME,
      IndexName: "EmailIndex",
      KeyConditionExpression: "userEmail = :email",
      ExpressionAttributeValues: {
        ":email": userEmail,
      },
    };

    const result = await dynamoClient.send(new QueryCommand(params));
    return result.Items || [];
  }
}

module.exports = UserInputService;
