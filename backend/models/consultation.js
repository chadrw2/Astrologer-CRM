const mongoose=require("mongoose");
const appointment = require("./appointment");

const consultationSchema=new mongoose.Schema(
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
        appointmentId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Appointment"
        },
        consultationType:{
            type:String
        },
        notes:{
            type:String,
            required:true
        },
        recommendations:{
            type:String,
            required:true
        }
    },
    {
        timestamps:true
    }
);
module.exports=mongoose.model("Consultation",consultationSchema);