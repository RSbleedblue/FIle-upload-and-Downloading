import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
        match : [/^\S+@\S+\.\S+$/,'Please enter a Valid Email address'],
    },
    password : {
        type : String,
        required : true,
    }
})

userSchema.pre("save", async function (next){
    const user = this;
    if(!user.isModified('password')){
        return next();
    }
    try{
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password,salt);
        next();
    }
    catch(err){
        next(err);
    }
})

userSchema.methods.comparePassword = function (validatePassword){
    return bcrypt.compare(validatePassword, this.password);
};

userSchema.methods.generateToken = function(){
    const JWTSignature = process.env.PRIVATE_KEY;
    const token = jwt.sign({email : this.email}, JWTSignature,{expiresIn:'2h'});
    return token;
}
export default mongoose.model("user",userSchema,"FileSharing");

