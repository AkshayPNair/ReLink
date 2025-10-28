import mongoose,{Document,Schema} from "mongoose";

export interface IUrl extends Document{
    shortId:string;
    originalUrl:string;
    userId:mongoose.Types.ObjectId;
    createdAt:Date;
}

const urlSchema=new Schema<IUrl>(
    {
        shortId:{
            type:String,
            required:true,
            unique:true
        },
        originalUrl:{
            type:String,
            required:true
        },
        userId:{
            type:Schema.Types.ObjectId,
            ref:"User",
            required:true
        }
    },
    {timestamps:true}
)

export default mongoose.model<IUrl>("Url",urlSchema)