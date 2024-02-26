import { Request,Response,NextFunction } from "express"
import { CreateVandorInput } from "../dto"
import { Vandor } from "../models";
import bcrypt from 'bcrypt'
import { GeneratePassword, GenerateSalt } from "../utility";


export const findVandor=async(id:string,email?:string)=>
{

        if(email){
       return await Vandor.findOne({email:email})
    
    }else{
        return await Vandor.findById(id)
    }
   
}


export const CreateVandor=async(req:Request,res:Response,next:NextFunction)=>{
    try {
      
            const {name,address,pincode,foodType,email,ownerName,password,phone}=<CreateVandorInput>req.body;

            console.log(password)
            const existingVandor= await findVandor('',email)
            if(existingVandor!==null){
                return res.json({"message":"A vandor is existi with this email ID"})
            }

// generated a salt
const salt =await GenerateSalt()
const userPassword=await GeneratePassword(password,salt);
// encrypt the password using the salt


const createVandor=await Vandor.create({
    name,address,pincode,foodType,email,ownerName,password:userPassword,salt:salt,
    phone,rating:0,serviceAvailable:false,coverImages:[],foods:[]
})


return res.json(createVandor)
    } catch (error) {
        next(error)
 
        

}}
export const GetVandors=async(req:Request,res:Response,next:NextFunction)=>{

    const vandors =await Vandor.find();
    if(vandors!==null){
return res.json(vandors);
    }
    return res.json({message:"vandors data not available"})
    
}


export const GetVandorById=async(req:Request,res:Response,next:NextFunction)=>{
    const vandorId=req.params.id;

    const vandor=await findVandor(vandorId);
if(vandor!==null){
    return res.json({message:"success find",vandor})
}

    res.json({message:"fucker vandor by id not found"})
}