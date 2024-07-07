const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const mongod = new MongoMemoryServer();

module.exports.connect = async () => {
    const uri = await mongod.getUri();

    mongooseOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        poolSize: 10,
    };
    await mongoose.connect(uri, mongooseOptions);
};

module.exports.closeDatabase = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mogod.stop();
};

module.exports.clearDatabase = async () => {
    const collections = mongoose.collections;
    for (let key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
    }
};
