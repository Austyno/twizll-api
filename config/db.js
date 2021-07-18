const { connect } = require('mongoose');

module.exports = async () => {
  return new Promise(async (resolve, reject) => {
    let url
    if(process.env.NODE_ENV === 'development'){
      url = process.env.MONGODB_DEV_URL
    }else{
      url = process.env.MONGODB_URL
    }

    try {
      const connectDB = await connect(url, {
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