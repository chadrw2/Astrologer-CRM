const mongoose=require("mongoose");

const appointmentSchema=new mongoose.Schema(
    {
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        clientId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Client",
            required:true
        },
        appointmentDate:{
            type:Date,
            required:true
        },
        duration:{
            type:Number,
            default:60
        },
        status:{
            type:String,
            enum:["scheduled","completed","cancelled"],
            default:"scheduled"
        },
        remarks:{
            type:String
        }
    },
    {
        timestamps:true
    }
);
module.exports=mongoose.model("Appointment",appointmentSchema);