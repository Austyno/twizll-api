const { connect } = require('mongoose');

module.exports = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const connectDB = await connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      });

      if (!connectDB) {
        throw new Error('Not connected');
      } else {
        console.log('Connected to DB');
      }

      resolve(true);
    } 
    
    catch (error) {
      console.log(error);
    }
  })
}