const User=require("../models/users");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");

//REGISTER USER
const registerUser=async(req,res)=>{
    try{
        const {name,email,password}=req.body;
        console.log("Register attempt for email:", email);
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"USER already Exists"});
        }

        const hashedPassword=await bcrypt.hash(password,10);
        const user=await User.create({name,email,password:hashedPassword});
        res.status(201).json({
            message:"User successfully resgistered",user:{id:user._id,name:user.name,email:user.email}
        })
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
}

//Login User
const loginUser=async(req,res)=>{
    try{
        const {email,password}=req.body;
        const user=await User.findOne({email});
        if(!user) return res.status(400).json({message:"invalid email"});
        const isMatch=await bcrypt.compare(
            password,
            user.password
        )
        if(!isMatch) return res.status(400).json({message:"incorrect password"});
        const token=jwt.sign(
            {
                id:user.id
            },
            process.env.JWT_SECRET,
            {
                expiresIn:"7d"
            }
        );
        res.json({
            message:"login successful",token,user:{id:user._id,name:user.name,email:user.email}
        });
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
};

module.exports={registerUser,loginUser};