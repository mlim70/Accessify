// Temporary in-memory storage until DynamoDB is set up
const inMemoryStorage = [];

class UserInputService {
    static async create(input) {
        const newInput = {
            id: Date.now().toString(),
            input,
            createdAt: new Date().toISOString()
        };
        inMemoryStorage.push(newInput);
        return newInput;
    }

    static async find() {
        return inMemoryStorage;
    }

    static async findOne(query) {
        return inMemoryStorage.find(item => {
            if (query['input.url'] && item.input.url !== query['input.url']) return false;
            if (query['input.preferences.colorBlindness'] && 
                item.input.preferences.colorBlindness !== query['input.preferences.colorBlindness']) return false;
            if (query['input.preferences.dyslexia'] && 
                item.input.preferences.dyslexia !== query['input.preferences.dyslexia']) return false;
            return true;
        });
    }
}

module.exports = UserInputService;