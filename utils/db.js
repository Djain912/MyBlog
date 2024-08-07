import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();



const URI = process.env.MONGODB_URI;
const connectdb = async()=>{
    try{
        const conn = await mongoose.connect(URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }catch(err){
        console.log(err);
        process.exit(0);
    }
}

export default connectdb;