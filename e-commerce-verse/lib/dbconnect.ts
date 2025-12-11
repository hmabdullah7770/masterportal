import mongoose from 'mongoose';
// import { buffer } from 'stream/consumers';
import {DB_NAME} from  '../constants';

const MONGODB_URI = process.env.MONGODB_URI!


if(!MONGODB_URI){
    throw new Error("Please define the connection")
}

let cached = global.mongoose;

if(!cached){
    cached = global.mongoose = {conn: null, promise: null}

}

export const connectDB = async()=>{


    if(cached.conn){

    return cached.conn;
}

if(!cached.promise){

    const opts ={

        bufferCommands: true,
        maxPoolSize: 10,
 
    };
     cached.promise =  mongoose.connect(MONGODB_URI,opts).then((mongoose) => mongoose.connection)
    

    try {
        cached.conn = await cached.promise;
        
    } catch (error) {
        cached.promise = null;
        throw  error;
    }
    

    return cached.conn;

  

}
}