import path from "path";
import userModel from "../Models/userModel.js";
import fs from 'fs';

class userController {
    constructor(){
    }
    async register(req,res){
        const {name,email,password} = req.body;
        const data = {name,email,password};
        const checkUser = await userModel.findOne({email});
        if(checkUser){
            return res.status(404).json({message : "User Already Registered", status : false})
        }
        try{     
            const user = new userModel(data);
            await user.save();
            return res.status(202).json({message : "User Successfully Created!", status: true})
        }
        catch(err){
            console.log(err);
            return res.status(404).json({message : "Unexpected Error Occured", status : false})
        }
    }
    async login(req,res){
        const { email , password } = req.body;
        const checkUser = await userModel.findOne( { email } )
        if(!checkUser){
            return res.status(404).json({message : "Unregistered User Kindly register first", status : false})
        }
        const comparePassword = await checkUser.comparePassword(password);
        if(!comparePassword){
            return res.status(400).json({message : "Wrong Password!", status : false})
        }
        const token = await checkUser.generateToken();
        return res.status(200).json({message : "Successfully Loggedw IN",access_Token : token, success : true});
    }
    async upload(req,res){
        console.log(req.file); 
        return res.status(200).json({message: "File Uploaded Successfully", success: true});  
    }
    async downloadFile(req,res){
        const { id } = req.params;
        fs.readdir("./uploads",(err,files)=>{
            if(err){
                return res.status(500).json({message:"Location for the file couldnt be found", success : false})
            }
            const file = files.find(file => file.includes(id));
            if(!file){
                return res.status(400).json({message : `${id} is not currently Available`, success : false})
            }
            const filePath = path.join('./uploads',file);
            return res.download(filePath,(err)=>{
                if(err){
                    console.log(err);
                    return res.status(500).json({message : "Unexpected Error Occured", success : false});
                }
            });
        })
    }
}

export default userController;