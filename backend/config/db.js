const mongoose = require('mongoose');
//Without this line, you cannot use MongoDB through Mongoose.
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
//module.exports = connectDB; is used to export the connectDB function from one file so that it can be used in another file.

 