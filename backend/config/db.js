const mongoose=require("mongoose");
const connectDB=async()=>{
    try{
        await mongoose.connect("mongodb://localhost:27017/astrologyCRM");
        console.log("mongoDB Connected");
    }
    catch(err){
        console.error(err);
        process.exit(1);
    }
};
module.exports=connectDB;