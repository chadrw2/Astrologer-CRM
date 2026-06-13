const mongoose= require("mongoose");

const clientSchema=new mongoose.Schema(
    {
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        name:{
            type:String,
            required:true
        },
        phone:{
            type:String,
            required:true
        },
        email:{
            type:String
        },
        gender:{
            type:String
        },
        birthdate:{
            type:Date
        },
        birthTime:{
            type:String
        },
        birthPlace:{
            type:String
        }
    },
    {
        timestamps:true
    }
);
module.exports=mongoose.model("Client",clientSchema);