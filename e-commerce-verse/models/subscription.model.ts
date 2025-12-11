import mongoose, { Schema,models,model} from "mongoose";


export interface ISubscription {
    
    _id?: mongoose.Types.ObjectId;
    subscriber: mongoose.Types.ObjectId;
    channel: mongoose.Types.ObjectId;


} 

const subscriberSchema = new Schema<ISubscription>({

subscriber:{
    type: Schema.Types.ObjectId,
    ref:"User"
}
,

channel:{

    type:Schema.Types.ObjectId,
    ref:"User"

}



},{timestamps:true}


)

 const Subscription = models.Subscriber || model<ISubscription>("Subscriber",subscriberSchema)

 export default Subscription;